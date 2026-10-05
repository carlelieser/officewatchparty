import { formatEpisodeCode } from '$lib/shared/format';
import type { Episode } from '$lib/features/episodes/types';

export type EpisodeReference = {
	season: number;
	episode: number;
};

const EPISODE_CODE_PATTERN = /^s(\d{2})e(\d{2})(?:-|$)/;

function slugifyLabel(label: string): string {
	const lowercase = label.toLowerCase();
	const withoutApostrophes = lowercase.replace(/['’]/g, '');
	const hyphenated = withoutApostrophes.replace(/[^a-z0-9]+/g, '-');
	return hyphenated.replace(/^-+|-+$/g, '');
}

export function episodeSlug(episode: Episode): string {
	const code = formatEpisodeCode(episode.season, episode.episode).toLowerCase();
	const labelSlug = slugifyLabel(episode.label);
	return labelSlug ? `${code}-${labelSlug}` : code;
}

// The title part is ignored so stale or shortened slugs can redirect to the canonical one.
export function parseEpisodeSlug(slug: string): EpisodeReference | null {
	const match = EPISODE_CODE_PATTERN.exec(slug.toLowerCase());
	if (!match) return null;

	const season = Number(match[1]);
	const episode = Number(match[2]);
	return { season, episode };
}
