import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../../../../app.css';
import SheetTestHarness from './sheet-test-harness.svelte';

describe('Sheet.Content', () => {
	it('plays the enter animation when opened', async () => {
		render(SheetTestHarness, { open: true });

		const dialog = page.getByRole('dialog');
		await expect.element(dialog).toBeInTheDocument();

		const animationName = getComputedStyle(dialog.element()).animationName;
		expect(animationName).toBe('enter');
	});
});
