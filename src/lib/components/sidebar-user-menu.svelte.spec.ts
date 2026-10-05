import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import '../../app.css';
import SidebarUserMenuTestHarness from './sidebar-user-menu-test-harness.svelte';

const EMAIL = 'pam@dundermifflin.com';

async function settleAnimations(element: Element): Promise<void> {
	const animations = element.getAnimations({ subtree: true });
	await Promise.all(animations.map((animation) => animation.finished));
}

describe('SidebarUserMenu', () => {
	it('opens above the trigger and stays on screen on mobile', async () => {
		await page.viewport(390, 844);
		render(SidebarUserMenuTestHarness, { email: EMAIL });

		const trigger = page.getByRole('button', { name: new RegExp(EMAIL) });
		await trigger.click();

		const menu = page.getByRole('menu');
		await expect.element(menu).toBeVisible();
		await settleAnimations(menu.element());

		const menuBounds = menu.element().getBoundingClientRect();
		const triggerBounds = trigger.element().getBoundingClientRect();
		expect(menuBounds.bottom).toBeLessThanOrEqual(triggerBounds.top);
		expect(menuBounds.left).toBeGreaterThanOrEqual(0);
		expect(menuBounds.right).toBeLessThanOrEqual(window.innerWidth);
	});
});
