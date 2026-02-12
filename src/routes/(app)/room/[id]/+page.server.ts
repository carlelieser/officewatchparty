import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Episodes } from '$lib/server/episodes';
import { sign } from '$lib/server/signed-url';
import { padNumber } from '$lib/shared/format';

function buildVideoPath(season: number, episode: number): string {
	const seasonCode = `S${padNumber(season)}`;
	return `/video/${seasonCode}/${seasonCode}E${padNumber(episode)}.mp4`;
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const room = await locals.repos.rooms.findByAlias(params.id);

	if (!room) error(404, 'Room not found');

	const isOwner = room.owner_id === locals.user.id;
	const members = await locals.repos.rooms.getMembers(room.id);
	const episode = room.season !== null && room.episode !== null
		? Episodes.find(room.season, room.episode)
		: null;
	const [comments, favorites] = await Promise.all([
		locals.repos.rooms.getComments(room.id),
		locals.repos.favorites.findByUserId(locals.user.id)
	]);

	let videoUrl = '';
	if (room.season !== null && room.episode !== null) {
		const path = buildVideoPath(room.season, room.episode);
		videoUrl = await sign(path);
	}

	return { room, members, isOwner, episode, comments, videoUrl, favorites };
};
