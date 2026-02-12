import type { PageServerLoad } from './$types';
import { Episodes } from '$lib/server/episodes';
import type { OwnedRoom } from '$lib/features/rooms/types';

export const load: PageServerLoad = async ({ locals }) => {
	const [favoritesData, roomsData] = await Promise.all([
		locals.repos.favorites.findByUserId(locals.user.id),
		locals.repos.rooms.findByOwnerId(locals.user.id)
	]);

	const favorites = Episodes.fromFavorites(favoritesData);

	const rooms: Array<OwnedRoom> = roomsData.map((room) => {
		const episode = Episodes.find(room.season, room.episode);
		return { ...room, label: episode?.label ?? `S${room.season}E${room.episode}` };
	});

	return { favorites, rooms };
};
