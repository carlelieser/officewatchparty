import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Request as WorkersRequest } from '@cloudflare/workers-types';

const CACHE_CONTROL_IMMUTABLE: string = 'public, max-age=31536000, immutable';

/**
 * Serve an episode thumbnail from R2. Thumbnails are public (not paywalled like
 * the video), small, and immutable, so there is no signature check and the full
 * object is cached at the edge. The object key mirrors the request path under
 * the `thumbnails/` prefix, e.g. `/thumb/S03/S03E05.jpg` ->
 * `thumbnails/S03/S03E05.jpg`.
 */
export const GET: RequestHandler = async ({ params, request, platform }) => {
	if (!platform?.env?.VIDEOS) error(500, 'Storage not configured');

	const objectKey = `thumbnails/${params.path}`;
	const cache = platform.caches.default;

	const cachedResponse = await cache.match(request as unknown as WorkersRequest);
	if (cachedResponse) return cachedResponse as unknown as Response;

	const object = await platform.env.VIDEOS.get(objectKey);
	if (!object) error(404, 'Not found');

	const headers = new Headers();
	headers.set('etag', object.httpEtag);
	headers.set('content-type', object.httpMetadata?.contentType ?? 'image/jpeg');
	headers.set('content-length', String(object.size));
	headers.set('cache-control', CACHE_CONTROL_IMMUTABLE);

	const body = object.body as unknown as ReadableStream;
	const [clientBody, cacheBody] = body.tee();

	const cacheResponse = new Response(cacheBody, { status: 200, headers });
	platform.ctx.waitUntil(cache.put(request.url, cacheResponse as never));

	return new Response(clientBody, { status: 200, headers });
};
