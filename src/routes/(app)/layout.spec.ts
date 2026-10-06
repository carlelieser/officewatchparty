import { describe, expect, it } from 'vitest';
import { load } from './+layout.server';
import type { WatchHistoryEntry } from '$lib/server/repos/watch-history';

type LayoutEvent = Parameters<typeof load>[0];

function createEvent(latestWatch: WatchHistoryEntry | null): LayoutEvent {
	const repos = {
		favorites: { findByUserId: async (): Promise<Array<never>> => [] },
		watchHistory: { findLatest: async (): Promise<WatchHistoryEntry | null> => latestWatch }
	};
	return { locals: { user: { id: 'user-1' }, repos } } as unknown as LayoutEvent;
}

describe('(app) layout load', () => {
	// A URL built here would be relative to the server-rendered page and point
	// somewhere else after client-side navigation (e.g. /seasons/watch).
	it('returns where to resume as data rather than a URL', async () => {
		const latestWatch = { season: 2, episode: 4, progress_seconds: 254.7, duration_seconds: 1300 };
		const data = await load(createEvent(latestWatch));

		expect(data).toMatchObject({ resume: { season: 2, episode: 4, timeSeconds: 254 } });
		expect(data).not.toHaveProperty('watchHref');
	});

	it('starts at the series premiere when nothing has been watched', async () => {
		const data = await load(createEvent(null));

		expect(data).toMatchObject({ resume: { season: 1, episode: 1, timeSeconds: 0 } });
	});
});
