import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Episodes } from '$lib/server/episodes';
import { findNextEpisode, findPreviousEpisode } from '$lib/features/episodes/next-episode';
import { episodeGuidePath, episodeSlug, parseEpisodeSlug } from '$lib/features/guide';

export const load: PageServerLoad = async ({ params }) => {
	const reference = parseEpisodeSlug(params.slug);
	if (!reference) error(404, 'Episode not found');

	const episode = Episodes.find(reference.season, reference.episode);
	if (!episode) error(404, 'Episode not found');

	// Old, shortened, or mistyped slugs permanently point at the canonical URL.
	const canonicalSlug = episodeSlug(episode);
	if (params.slug !== canonicalSlug) redirect(301, episodeGuidePath(episode));

	const previous = findPreviousEpisode(episode, Episodes.all);
	const next = findNextEpisode(episode, Episodes.all);

	return { episode, previous, next };
};
