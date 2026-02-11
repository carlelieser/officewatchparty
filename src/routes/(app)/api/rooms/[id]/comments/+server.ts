import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals, params }) => {
	const { content } = await request.json();
	if (!content?.trim()) error(400, 'Content is required');

	const roomId = await locals.repos.rooms.findIdByAlias(params.id);
	if (!roomId) error(404, 'Room not found');

	await locals.repos.comments.insert(roomId, locals.user.id, content.trim());
	return json({ success: true });
};
