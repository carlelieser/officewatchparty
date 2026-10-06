import type { Episode } from '$lib/features/episodes/types';
import type { EpisodeReference } from '$lib/features/guide';
import type { EpisodeFinder } from './types';

function isEpisode(candidate: Episode | null): candidate is Episode {
	return candidate !== null;
}

export function resolveHeroEpisode(
	reference: EpisodeReference,
	findEpisode: EpisodeFinder
): Episode | null {
	return findEpisode(reference.season, reference.episode);
}

export function resolveFeaturedEpisodes(
	references: Array<EpisodeReference>,
	findEpisode: EpisodeFinder
): Array<Episode> {
	const candidates = references.map((reference) =>
		findEpisode(reference.season, reference.episode)
	);
	return candidates.filter(isEpisode);
}
