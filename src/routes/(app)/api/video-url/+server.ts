import { error, json } from '@sveltejs/kit';
import { sign } from '$lib/server/signed-url';
import { padNumber } from '$lib/shared/format';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const season = Number(url.searchParams.get('season'));
	const episode = Number(url.searchParams.get('episode'));

	if (!season || !episode) error(400, 'season and episode are required');

	const seasonCode = `S${padNumber(season)}`;
	const path = `/video/${seasonCode}/${seasonCode}E${padNumber(episode)}.mp4`;
	const signedUrl = await sign(path);

	return json({ url: signedUrl });
};
