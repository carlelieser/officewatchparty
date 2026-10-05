import { absoluteUrl, type JsonLdObject } from '$lib/features/seo';
import { episodeThumbnailUrl } from '$lib/shared/format';
import { GUIDE_PATH, episodeGuidePath, seasonGuidePath } from './paths';
import type { Episode, Season } from '$lib/features/episodes/types';

export const SERIES_NAME = 'The Office';

function seriesReference(): JsonLdObject {
	return {
		'@type': 'TVSeries',
		name: SERIES_NAME,
		url: absoluteUrl(GUIDE_PATH)
	};
}

function seasonReference(season: number): JsonLdObject {
	return {
		'@type': 'TVSeason',
		seasonNumber: season,
		url: absoluteUrl(seasonGuidePath(season))
	};
}

function episodeReference(episode: Episode): JsonLdObject {
	return {
		'@type': 'TVEpisode',
		name: episode.label,
		episodeNumber: episode.episode,
		url: absoluteUrl(episodeGuidePath(episode))
	};
}

function seasonEntry(season: Season): JsonLdObject {
	return {
		...seasonReference(season.season),
		numberOfEpisodes: season.episodes.length
	};
}

export function seriesSchema(seasons: Array<Season>): JsonLdObject {
	const episodeCount = seasons.reduce((total, season) => total + season.episodes.length, 0);

	return {
		'@context': 'https://schema.org',
		...seriesReference(),
		numberOfSeasons: seasons.length,
		numberOfEpisodes: episodeCount,
		containsSeason: seasons.map(seasonEntry)
	};
}

export function seasonSchema(season: number, episodes: Array<Episode>): JsonLdObject {
	return {
		'@context': 'https://schema.org',
		...seasonReference(season),
		name: `${SERIES_NAME} Season ${season}`,
		numberOfEpisodes: episodes.length,
		partOfSeries: seriesReference(),
		episode: episodes.map(episodeReference)
	};
}

export function episodeSchema(episode: Episode): JsonLdObject {
	const thumbnailPath = episodeThumbnailUrl(episode.season, episode.episode);

	return {
		'@context': 'https://schema.org',
		...episodeReference(episode),
		description: episode.description,
		image: absoluteUrl(thumbnailPath),
		partOfSeason: seasonReference(episode.season),
		partOfSeries: seriesReference()
	};
}
