import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { season, episode, progress, duration } = await request.json();
	if (!season || !episode) error(400, 'season and episode are required');
	if (typeof progress !== 'number' || typeof duration !== 'number') {
		error(400, 'progress and duration are required');
	}

	await locals.repos.watchHistory.saveProgress(locals.user.id, season, episode, progress, duration);
	return json({ success: true });
};
