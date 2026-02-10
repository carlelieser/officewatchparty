import { error } from '@sveltejs/kit';
import { SEEDBOX_BASE_URL, SEEDBOX_CREDENTIALS } from '$env/static/private';
import type { RequestHandler } from './$types';

const pad = (n: number) => String(n).padStart(2, '0');

export const GET: RequestHandler = async ({ params, locals, request }) => {
	const { user } = await locals.safeGetSession();
	if (!user) error(401, 'Unauthorized');

	const season = Number(params.season);
	const episode = Number(params.episode);

	if (!season || !episode) error(400, 'Invalid season or episode');

	const s = pad(season);
	const e = pad(episode);
	const upstream = `${SEEDBOX_BASE_URL}/S${s}/S${s}E${e}.mp4`;

	const headers: Record<string, string> = {
		Authorization: `Basic ${btoa(SEEDBOX_CREDENTIALS)}`
	};

	const range = request.headers.get('range');
	if (range) {
		headers['Range'] = range;
	}

	const res = await fetch(upstream, { headers });

	if (!res.ok && res.status !== 206) {
		error(res.status, 'Upstream error');
	}

	return new Response(res.body, {
		status: res.status,
		headers: Object.fromEntries(res.headers.entries())
	});
};
