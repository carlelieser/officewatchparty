import { describe, expect, it } from 'vitest';
import { Episodes } from '$lib/server/episodes';
import type { Episode } from '$lib/features/episodes/types';
import type { EpisodeReference } from '$lib/features/guide';
import { FEATURED_EPISODE_REFERENCES, HERO_EPISODE_REFERENCE } from './featured-episodes';
import { resolveFeaturedEpisodes, resolveHeroEpisode } from './landing-episodes';

const FIXTURE_EPISODES: Array<Episode> = [
	{ season: 1, episode: 1, label: 'Pilot', description: '' },
	{ season: 1, episode: 2, label: 'Diversity Day', description: '' }
];

function findFixtureEpisode(season: number, episode: number): Episode | null {
	const match = FIXTURE_EPISODES.find(
		(candidate) => candidate.season === season && candidate.episode === episode
	);
	return match ?? null;
}

function findCatalogEpisode(season: number, episode: number): Episode | null {
	return Episodes.find(season, episode);
}

describe('resolveFeaturedEpisodes', () => {
	it('drops references that do not resolve and keeps the given order', () => {
		const references: Array<EpisodeReference> = [
			{ season: 1, episode: 2 },
			{ season: 9, episode: 99 },
			{ season: 1, episode: 1 }
		];
		const episodes = resolveFeaturedEpisodes(references, findFixtureEpisode);
		expect(episodes.map((episode) => episode.label)).toEqual(['Diversity Day', 'Pilot']);
	});
});

describe('resolveHeroEpisode', () => {
	it('returns null when the reference is unknown', () => {
		expect(resolveHeroEpisode({ season: 9, episode: 99 }, findFixtureEpisode)).toBeNull();
	});
});

describe('landing episode references', () => {
	it('every featured reference exists in the catalog', () => {
		const episodes = resolveFeaturedEpisodes(FEATURED_EPISODE_REFERENCES, findCatalogEpisode);
		expect(episodes).toHaveLength(FEATURED_EPISODE_REFERENCES.length);
	});

	it('the hero reference exists in the catalog', () => {
		expect(resolveHeroEpisode(HERO_EPISODE_REFERENCE, findCatalogEpisode)).not.toBeNull();
	});
});
