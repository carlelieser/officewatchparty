import { episodeSlug } from './slug';
import type { Episode } from '$lib/features/episodes/types';

export const GUIDE_PATH = '/the-office' as const;

export function seasonGuidePath(season: number): `/the-office/season-${number}` {
	return `/the-office/season-${season}`;
}

export function episodeGuidePath(episode: Episode): `/the-office/${string}` {
	const slug = episodeSlug(episode);
	return `/the-office/${slug}`;
}

export function watchQuery(episode: Episode): string {
	const params = new URLSearchParams({
		season: String(episode.season),
		episode: String(episode.episode)
	});
	return params.toString();
}
