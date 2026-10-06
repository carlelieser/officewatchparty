import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Episodes } from '$lib/server/episodes';
import type { Episode } from '$lib/features/episodes/types';
import {
	FEATURED_EPISODE_REFERENCES,
	HERO_EPISODE_REFERENCE,
	resolveFeaturedEpisodes,
	resolveHeroEpisode
} from '$lib/features/landing';

function findEpisode(season: number, episode: number): Episode | null {
	return Episodes.find(season, episode);
}

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (user) redirect(303, '/home');

	const heroEpisode = resolveHeroEpisode(HERO_EPISODE_REFERENCE, findEpisode);
	const featuredEpisodes = resolveFeaturedEpisodes(FEATURED_EPISODE_REFERENCES, findEpisode);
	return { heroEpisode, featuredEpisodes };
};
