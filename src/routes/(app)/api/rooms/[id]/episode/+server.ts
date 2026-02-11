import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, locals, params }) => {
	const { season, episode } = await request.json();
	if (!season || !episode) error(400, 'Season and episode are required');

	await locals.repos.rooms.updateEpisode(params.id, season, episode);
	return json({ success: true });
};
