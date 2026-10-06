import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { RoomMockup } from '$lib/features/landing';
import type { Episode } from '$lib/features/episodes/types';

const STRESS_RELIEF: Episode = {
	season: 5,
	episode: 14,
	label: 'Stress Relief Part 1',
	description: ''
};

describe('RoomMockup', () => {
	it('shows the thumbnail of the given episode', async () => {
		const { container } = render(RoomMockup, { episode: STRESS_RELIEF });
		const thumbnail = container.querySelector('img');
		expect(thumbnail?.getAttribute('src')).toBe('/thumb/S05/S05E14.jpg');
	});

	it('is hidden from assistive technology', async () => {
		const { container } = render(RoomMockup, { episode: STRESS_RELIEF });
		expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
	});
});
