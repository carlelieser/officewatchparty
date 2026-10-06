import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { GuideTeaser } from '$lib/features/landing';
import type { Episode } from '$lib/features/episodes/types';

const EPISODES: Array<Episode> = [
	{ season: 2, episode: 1, label: 'The Dundies', description: '' },
	{ season: 4, episode: 13, label: 'Dinner Party', description: '' }
];

describe('GuideTeaser', () => {
	it('links each featured episode to its guide page', async () => {
		render(GuideTeaser, { episodes: EPISODES });
		const dundies = page.getByRole('link', { name: /The Dundies/ });
		await expect.element(dundies).toHaveAttribute('href', '/the-office/s02e01-the-dundies');
		const dinnerParty = page.getByRole('link', { name: /Dinner Party/ });
		await expect.element(dinnerParty).toHaveAttribute('href', '/the-office/s04e13-dinner-party');
	});

	it('links to the full episode guide', async () => {
		render(GuideTeaser, { episodes: EPISODES });
		const guideLink = page.getByRole('link', { name: /Browse the full episode guide/ });
		await expect.element(guideLink).toHaveAttribute('href', '/the-office');
	});

	it('renders nothing without episodes', async () => {
		const { container } = render(GuideTeaser, { episodes: [] });
		await expect.poll(() => container.querySelector('section')).toBeNull();
	});
});
