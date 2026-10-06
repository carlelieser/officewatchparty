import { page } from 'vitest/browser';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import GoogleSignInForm from './google-sign-in-form.svelte';

function preventNavigation(event: SubmitEvent): void {
	event.preventDefault();
}

describe('GoogleSignInForm', () => {
	beforeAll(() => window.addEventListener('submit', preventNavigation));
	afterAll(() => window.removeEventListener('submit', preventNavigation));

	it('submits the destination to the Google sign-in action', async () => {
		const { container } = render(GoogleSignInForm, { redirectTo: '/favorites' });

		const form = container.querySelector('form');
		const redirectInput = container.querySelector<HTMLInputElement>('input[name="redirectTo"]');
		expect(form?.getAttribute('action')).toBe('?/signInWithGoogle&redirectTo=%2Ffavorites');
		expect(redirectInput?.value).toBe('/favorites');
	});

	it('disables the button while redirecting and re-enables it when restored from history', async () => {
		render(GoogleSignInForm, { redirectTo: '' });

		await page.getByRole('button', { name: 'Continue with Google' }).click();
		const pendingButton = page.getByRole('button', { name: 'Redirecting...' });
		await expect.element(pendingButton).toBeDisabled();

		window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
		await expect.element(page.getByRole('button', { name: 'Continue with Google' })).toBeEnabled();
	});
});
