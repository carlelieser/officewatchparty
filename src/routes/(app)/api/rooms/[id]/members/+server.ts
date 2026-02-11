import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals, params }) => {
	const { email } = await request.json();
	if (!email) error(400, 'Email is required');

	const roomId = await locals.repos.rooms.findIdByAlias(params.id);
	if (!roomId) error(404, 'Room not found');

	await locals.repos.rooms.grantAccess(roomId, email);
	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request, locals, params }) => {
	const { user_id } = await request.json();
	if (!user_id) error(400, 'User ID is required');

	const roomId = await locals.repos.rooms.findIdByAlias(params.id);
	if (!roomId) error(404, 'Room not found');

	await locals.repos.rooms.revokeAccess(roomId, user_id);
	return json({ success: true });
};
