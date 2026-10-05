import type { PageServerLoad } from './$types';
import { Episodes } from '$lib/server/episodes';

export const load: PageServerLoad = async () => {
	return { seasons: Episodes.bySeason() };
};
