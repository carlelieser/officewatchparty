import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, locals, params }) => {
	const { autoplay } = await request.json();
	if (typeof autoplay !== 'boolean') error(400, 'Invalid autoplay value');

	await locals.repos.rooms.updateAutoplay(params.id, autoplay);
	return json({ success: true });
};
