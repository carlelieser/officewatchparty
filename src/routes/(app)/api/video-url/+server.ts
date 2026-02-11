import { error, json } from '@sveltejs/kit';
import { sign } from '$lib/server/signed-url';
import type { RequestHandler } from './$types';

const pad = (n: number) => String(n).padStart(2, '0');

export const GET: RequestHandler = async ({ url }) => {
	const season = Number(url.searchParams.get('season'));
	const episode = Number(url.searchParams.get('episode'));

	if (!season || !episode) error(400, 'season and episode are required');

	const path = `/video/S${pad(season)}/S${pad(season)}E${pad(episode)}.mp4`;
	const signedUrl = await sign(path);

	return json({ url: signedUrl });
};
