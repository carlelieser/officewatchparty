import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import HomeSectionsTestHarness from './home-sections-test-harness.svelte';
import type { HomeSectionKey, SaveVisibilityOutcome } from '$lib/features/home-sections';

type SaveCall = {
	section: HomeSectionKey;
	isHidden: boolean;
};

type FakeSave = {
	calls: Array<SaveCall>;
	save: (section: HomeSectionKey, isHidden: boolean) => Promise<SaveVisibilityOutcome>;
};

function createFakeSave(outcome: SaveVisibilityOutcome): FakeSave {
	const calls: Array<SaveCall> = [];
	return {
		calls,
		async save(section: HomeSectionKey, isHidden: boolean): Promise<SaveVisibilityOutcome> {
			calls.push({ section, isHidden });
			return outcome;
		}
	};
}

function hiddenGroupToggle(): ReturnType<typeof page.getByRole> {
	return page.getByRole('button', { name: /hidden sections/ });
}

describe('HomeSections', () => {
	it('shows only available sections and no hidden group when nothing is hidden', async () => {
		render(HomeSectionsTestHarness, {
			initialHidden: [],
			save: createFakeSave({ kind: 'saved' }).save
		});

		await expect.element(page.getByText('Favorite episodes')).toBeVisible();
		await expect.element(page.getByText('Watch party rooms')).toBeVisible();
		await expect.element(page.getByText('Continue Watching')).not.toBeInTheDocument();
		await expect.element(hiddenGroupToggle()).not.toBeInTheDocument();
	});

	it('moves a hidden section into the collapsed hidden group and confirms it', async () => {
		const fake = createFakeSave({ kind: 'saved' });
		render(HomeSectionsTestHarness, { initialHidden: [], save: fake.save });

		await page.getByRole('button', { name: 'Hide Favorites' }).click();

		await expect.element(page.getByText('Favorites hidden')).toBeVisible();
		await expect.element(page.getByText('Hidden (1)')).toBeVisible();
		await expect.element(page.getByText('Favorite episodes')).not.toBeVisible();
		expect(fake.calls).toEqual([{ section: 'favorites', isHidden: true }]);

		await hiddenGroupToggle().click();

		await expect.element(page.getByText('Favorite episodes')).toBeVisible();
	});

	it('restores a hidden section and removes the empty hidden group', async () => {
		const fake = createFakeSave({ kind: 'saved' });
		render(HomeSectionsTestHarness, { initialHidden: ['rooms'], save: fake.save });

		await hiddenGroupToggle().click();
		await page.getByRole('button', { name: 'Show Your Rooms' }).click();

		await expect.element(page.getByText('Your Rooms is back on your home page')).toBeVisible();
		await expect.element(page.getByRole('button', { name: 'Hide Your Rooms' })).toBeVisible();
		await expect.element(hiddenGroupToggle()).not.toBeInTheDocument();
		expect(fake.calls).toEqual([{ section: 'rooms', isHidden: false }]);
	});

	it('keeps the section in place and explains when hiding fails', async () => {
		render(HomeSectionsTestHarness, {
			initialHidden: [],
			save: createFakeSave({ kind: 'failed' }).save
		});

		await page.getByRole('button', { name: 'Hide Favorites' }).click();

		await expect.element(page.getByText(/Couldn't hide Favorites/)).toBeVisible();
		await expect.element(page.getByText('Favorite episodes')).toBeVisible();
		await expect.element(hiddenGroupToggle()).not.toBeInTheDocument();
	});
});
