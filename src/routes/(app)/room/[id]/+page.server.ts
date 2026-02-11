import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Episodes } from '$lib/server/episodes';

export const load: PageServerLoad = async ({ params, locals }) => {
	const room = await locals.repos.rooms.findByAlias(params.id);

	if (!room) error(404, 'Room not found');

	const isOwner = room.owner_id === locals.user.id;
	const members = await locals.repos.rooms.getMembers(room.id);
	const episode = Episodes.find(room.season, room.episode);
	const comments = await locals.repos.rooms.getComments(room.id);

	return { room, members, isOwner, episode, comments };
};
