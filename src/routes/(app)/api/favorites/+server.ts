import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { season, episode } = await request.json();
	if (!season || !episode) error(400, 'Season and episode are required');

	await locals.repos.favorites.insert(locals.user.id, season, episode);
	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const { season, episode } = await request.json();
	if (!season || !episode) error(400, 'Season and episode are required');

	await locals.repos.favorites.delete(locals.user.id, season, episode);
	return json({ success: true });
};
