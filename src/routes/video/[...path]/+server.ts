import { error } from '@sveltejs/kit';
import { SEEDBOX_BASE_URL, SEEDBOX_CREDENTIALS } from '$env/static/private';
import { verify } from '$lib/server/signed-url';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url, request }) => {
	const expires = url.searchParams.get('expires');
	const sig = url.searchParams.get('sig');

	if (!expires || !sig) error(403, 'Forbidden');

	const path = `/video/${params.path}`;
	const valid = await verify(path, expires, sig);

	if (!valid) error(403, 'Forbidden');

	const upstream = `${SEEDBOX_BASE_URL}/${params.path}`;
	const headers: Record<string, string> = {
		Authorization: `Basic ${btoa(SEEDBOX_CREDENTIALS)}`
	};

	const range = request.headers.get('range');
	if (range) {
		headers['Range'] = range;
	}

	const response = await fetch(upstream, { headers });

	if (!response.ok && response.status !== 206) {
		error(response.status, 'Upstream error');
	}

	return new Response(response.body, {
		status: response.status,
		headers: Object.fromEntries(response.headers.entries())
	});
};
