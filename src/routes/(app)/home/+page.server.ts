import type { PageServerLoad } from './$types';
import { Episodes } from '$lib/server/episodes';
import type { OwnedRoom } from '$lib/features/rooms/types';
import type { ContinueWatchingItem } from '$lib/features/episodes/types';

export const load: PageServerLoad = async ({ locals }) => {
	const [favoritesData, roomsData, historyData] = await Promise.all([
		locals.repos.favorites.findByUserId(locals.user.id),
		locals.repos.rooms.findByOwnerId(locals.user.id),
		locals.repos.watchHistory.findContinueWatching(locals.user.id)
	]);

	const favorites = Episodes.fromFavorites(favoritesData);

	const rooms: Array<OwnedRoom> = roomsData.map((room) => {
		const episode = Episodes.find(room.season, room.episode);
		return { ...room, label: episode?.label ?? `S${room.season}E${room.episode}` };
	});

	const continueWatching: Array<ContinueWatchingItem> = historyData
		.map((entry) => {
			const episode = Episodes.find(entry.season, entry.episode);
			if (!episode) return null;
			return {
				episode,
				progressSeconds: entry.progress_seconds,
				durationSeconds: entry.duration_seconds
			};
		})
		.filter((item): item is ContinueWatchingItem => item !== null);

	return { favorites, rooms, continueWatching };
};
