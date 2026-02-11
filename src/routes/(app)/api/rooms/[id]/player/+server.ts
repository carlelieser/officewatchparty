import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, locals, params }) => {
	const { is_playing, player_time } = await request.json();

	await locals.repos.rooms.updatePlayerState(
		params.id,
		locals.user.id,
		Boolean(is_playing),
		Number(player_time) || 0
	);

	return json({ success: true });
};
