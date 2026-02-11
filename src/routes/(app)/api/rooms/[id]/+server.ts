import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	await locals.repos.rooms.delete(params.id, locals.user.id);
	return json({ success: true });
};
