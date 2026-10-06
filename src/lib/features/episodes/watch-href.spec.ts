import { describe, expect, it } from 'vitest';
import { watchHref } from './watch-href';

describe('watchHref', () => {
	it('links to the episode at its saved time', () => {
		expect(watchHref({ season: 1, episode: 1, timeSeconds: 254 })).toBe(
			'/watch?season=1&episode=1&t=254'
		);
	});

	it('omits the time when there is nothing to resume', () => {
		expect(watchHref({ season: 3, episode: 9, timeSeconds: 0 })).toBe('/watch?season=3&episode=9');
	});
});
