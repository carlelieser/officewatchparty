import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals, params }) => {
	const { season, episode, emoji } = await request.json();
	if (!emoji?.trim()) error(400, 'Emoji is required');
	if (!season || !episode) error(400, 'Season and episode are required');

	const roomId = await locals.repos.rooms.findIdByAlias(params.id);
	if (!roomId) error(404, 'Room not found');

	await locals.repos.reactions.add(roomId, locals.user.id, season, episode, emoji);
	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request, locals, params }) => {
	const { season, episode, emoji } = await request.json();
	if (!emoji?.trim()) error(400, 'Emoji is required');
	if (!season || !episode) error(400, 'Season and episode are required');

	const roomId = await locals.repos.rooms.findIdByAlias(params.id);
	if (!roomId) error(404, 'Room not found');

	await locals.repos.reactions.remove(roomId, locals.user.id, season, episode, emoji);
	return json({ success: true });
};
