import type { PageServerLoad } from './$types';
import { Episodes } from '$lib/server/episodes';

export const load: PageServerLoad = async ({ locals }) => {
	const favoritesData = await locals.repos.favorites.findByUserId(locals.user.id);
	return { favorites: Episodes.fromFavorites(favoritesData) };
};
