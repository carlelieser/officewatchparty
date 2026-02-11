import { error } from '@sveltejs/kit';
import { SEEDBOX_BASE_URL, SEEDBOX_CREDENTIALS } from '$env/static/private';
import type { RequestHandler } from './$types';

const pad = (n: number) => String(n).padStart(2, '0');

export const GET: RequestHandler = async ({ params, request }) => {
	const season = Number(params.season);
	const episode = Number(params.episode);

	if (!season || !episode) error(400, 'Invalid season or episode');

	const paddedSeason = pad(season);
	const paddedEpisode = pad(episode);
	const upstream = `${SEEDBOX_BASE_URL}/S${paddedSeason}/S${paddedSeason}E${paddedEpisode}.mp4`;

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
