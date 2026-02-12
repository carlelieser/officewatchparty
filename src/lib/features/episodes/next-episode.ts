import type { Episode } from '$lib/features/episodes/types';

function findCurrentIndex(current: Episode, episodes: Array<Episode>): number {
	return episodes.findIndex(
		(candidate) =>
			candidate.season === current.season && candidate.episode === current.episode
	);
}

export function findNextEpisode(
	current: Episode,
	episodes: Array<Episode>
): Episode | null {
	const currentIndex = findCurrentIndex(current, episodes);

	if (currentIndex === -1 || currentIndex === episodes.length - 1) return null;

	return episodes[currentIndex + 1];
}

export function findPreviousEpisode(
	current: Episode,
	episodes: Array<Episode>
): Episode | null {
	const currentIndex = findCurrentIndex(current, episodes);

	if (currentIndex <= 0) return null;

	return episodes[currentIndex - 1];
}
