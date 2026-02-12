import type { LayoutServerLoad } from './$types';
import { Episodes } from '$lib/server/episodes';

export const load: LayoutServerLoad = async ({ locals }) => {
	return { user: locals.user, episodes: Episodes.all };
};
