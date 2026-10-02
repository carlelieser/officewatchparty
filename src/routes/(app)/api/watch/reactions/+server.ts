import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { season, episode, emoji } = await request.json();
	if (!emoji?.trim()) error(400, 'Emoji is required');
	if (!season || !episode) error(400, 'Season and episode are required');

	await locals.repos.episodeReactions.add(season, episode, locals.user.id, emoji);
	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const { season, episode, emoji } = await request.json();
	if (!emoji?.trim()) error(400, 'Emoji is required');
	if (!season || !episode) error(400, 'Season and episode are required');

	await locals.repos.episodeReactions.remove(season, episode, locals.user.id, emoji);
	return json({ success: true });
};
