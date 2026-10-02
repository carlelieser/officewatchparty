import { error } from '@sveltejs/kit';
import { verify } from '$lib/server/signed-url';
import type { RequestHandler } from './$types';
import type {
	Cache as WorkersCache,
	R2Bucket,
	R2Range,
	Request as WorkersRequest
} from '@cloudflare/workers-types';

type ParsedRange = {
	offset: number;
	length: number;
};

const CACHE_CONTROL_IMMUTABLE: string = 'public, max-age=31536000, immutable';

/**
 * Parse a single-range HTTP `Range` header against a known object size.
 * Returns null for a missing or unsatisfiable header so the caller serves the
 * full object instead.
 */
function parseRange(header: string | null, objectSize: number): ParsedRange | null {
	if (!header) return null;

	const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
	if (!match) return null;

	const startText = match[1];
	const endText = match[2];
	if (startText === '' && endText === '') return null;

	// `bytes=-N` requests the final N bytes.
	if (startText === '') {
		const suffixLength = Number(endText);
		if (suffixLength <= 0) return null;
		const clampedLength = Math.min(suffixLength, objectSize);
		return { offset: objectSize - clampedLength, length: clampedLength };
	}

	const offset = Number(startText);
	if (offset >= objectSize) return null;

	const inclusiveEnd = endText === '' ? objectSize - 1 : Number(endText);
	const clampedEnd = Math.min(inclusiveEnd, objectSize - 1);
	const length = clampedEnd - offset + 1;
	if (length <= 0) return null;

	return { offset, length };
}

/**
 * Build the cache key URL for an object. Signature query parameters are
 * stripped so every viewer's distinct signed URL maps to one cached entry. The
 * full object is cached once, and the Cache API synthesises partial responses
 * from it for subsequent range requests.
 */
function buildCacheKeyUrl(requestUrl: string): string {
	const cacheUrl = new URL(requestUrl);
	cacheUrl.search = '';
	return cacheUrl.toString();
}

function buildBaseHeaders(contentType: string, objectEtag: string): Headers {
	const headers = new Headers();
	headers.set('etag', objectEtag);
	headers.set('accept-ranges', 'bytes');
	headers.set('content-type', contentType);
	headers.set('cache-control', CACHE_CONTROL_IMMUTABLE);
	return headers;
}

/**
 * Read the full object from R2 and store it in the edge cache as a 200. R2
 * reads reach the Worker over Cloudflare's internal network, so this read is
 * free; it runs via `waitUntil` so it never blocks the client response. The
 * Cache API serves both full and range requests from this single stored entry.
 */
async function populateCache(
	videos: R2Bucket,
	objectKey: string,
	cacheKeyUrl: string,
	cache: WorkersCache,
	contentType: string
): Promise<void> {
	const fullObject = await videos.get(objectKey);
	if (!fullObject) return;

	const headers = buildBaseHeaders(contentType, fullObject.httpEtag);
	headers.set('content-length', String(fullObject.size));

	const body = fullObject.body as unknown as ReadableStream;
	const cacheResponse = new Response(body, { status: 200, headers });
	await cache.put(cacheKeyUrl, cacheResponse as never);
}

export const GET: RequestHandler = async ({ params, url, request, platform }) => {
	const expires = url.searchParams.get('expires');
	const signature = url.searchParams.get('sig');

	if (!expires || !signature) error(403, 'Forbidden');

	const signedPath = `/video/${params.path}`;
	const isValid = await verify(signedPath, expires, signature);

	if (!isValid) error(403, 'Forbidden');

	if (!platform?.env?.VIDEOS) error(500, 'Storage not configured');

	// Object key mirrors the signed path without the `/video/` prefix,
	// e.g. signed `/video/S03/S03E05.mp4` -> R2 key `S03/S03E05.mp4`.
	const objectKey = params.path;
	const rangeHeader = request.headers.get('range');

	const cache = platform.caches.default;

	// On a hit, passing the original request (with its Range header) lets the
	// Cache API answer full requests with 200 and range requests with a
	// synthesised 206.
	const cachedResponse = await cache.match(request as unknown as WorkersRequest);
	if (cachedResponse) return cachedResponse as unknown as Response;

	// Cold miss: read the exact bytes the client asked for so a range request
	// never streams the whole object. The range is resolved after a metadata
	// read so it can be validated against the true object size.
	const head = await platform.env.VIDEOS.head(objectKey);
	if (!head) error(404, 'Not found');

	const objectSize = head.size;
	const contentType = head.httpMetadata?.contentType ?? 'video/mp4';
	const requestedRange = parseRange(rangeHeader, objectSize);

	const cacheKeyUrl = buildCacheKeyUrl(request.url);
	function fillCache(): Promise<void> {
		return populateCache(platform!.env.VIDEOS, objectKey, cacheKeyUrl, cache, contentType);
	}
	platform.ctx.waitUntil(fillCache());

	if (!requestedRange) {
		const fullObject = await platform.env.VIDEOS.get(objectKey);
		if (!fullObject) error(404, 'Not found');

		const headers = buildBaseHeaders(contentType, fullObject.httpEtag);
		headers.set('content-length', String(objectSize));
		const body = fullObject.body as unknown as ReadableStream;
		return new Response(body, { status: 200, headers });
	}

	const r2Range: R2Range = { offset: requestedRange.offset, length: requestedRange.length };
	const rangedObject = await platform.env.VIDEOS.get(objectKey, { range: r2Range });
	if (!rangedObject) error(404, 'Not found');

	const end = requestedRange.offset + requestedRange.length - 1;
	const headers = buildBaseHeaders(contentType, rangedObject.httpEtag);
	headers.set('content-range', `bytes ${requestedRange.offset}-${end}/${objectSize}`);
	headers.set('content-length', String(requestedRange.length));

	const body = rangedObject.body as unknown as ReadableStream;
	return new Response(body, { status: 206, headers });
};
