import type { PageServerLoad } from './$types';
import { Episodes } from '$lib/server/episodes';
import type { OwnedRoom } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
	const [favData, roomData] = await Promise.all([
		locals.repos.favorites.findByUserId(locals.user.id),
		locals.repos.rooms.findByOwnerId(locals.user.id)
	]);

	const favorites = Episodes.fromFavorites(favData);

	const rooms: OwnedRoom[] = roomData.map((room) => {
		const episode = Episodes.find(room.season, room.episode);
		return { ...room, label: episode.label };
	});

	return { favorites, rooms };
};
