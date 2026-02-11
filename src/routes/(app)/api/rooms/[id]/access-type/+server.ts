import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, locals, params }) => {
	const { access_type } = await request.json();
	if (access_type !== 'invite_only' && access_type !== 'link') error(400, 'Invalid access type');

	await locals.repos.rooms.updateAccessType(params.id, access_type);
	return json({ success: true });
};
