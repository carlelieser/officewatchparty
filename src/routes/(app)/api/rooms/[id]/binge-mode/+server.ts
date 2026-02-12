import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, locals, params }) => {
	const { binge_mode } = await request.json();
	if (typeof binge_mode !== 'boolean') error(400, 'Invalid binge mode value');

	await locals.repos.rooms.updateBingeMode(params.id, binge_mode);
	return json({ success: true });
};
