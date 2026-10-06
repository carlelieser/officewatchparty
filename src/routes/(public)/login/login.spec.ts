import { describe, expect, it, vi } from 'vitest';
import { isActionFailure, isRedirect, type Redirect } from '@sveltejs/kit';
import { actions, load } from './+page.server';

type ActionEvent = Parameters<typeof actions.signInWithGoogle>[0];
type LoadEvent = Parameters<typeof load>[0];

type OAuthOptions = {
	provider: string;
	options: { redirectTo: string };
};

type OAuthResult = {
	data: { url: string | null };
	error: Error | null;
};

type SignInWithOAuth = (options: OAuthOptions) => Promise<OAuthResult>;

const GOOGLE_URL = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=test';

function createActionEvent(redirectTo: string, signInWithOAuth: SignInWithOAuth): ActionEvent {
	const body = new URLSearchParams({ redirectTo });
	const request = new Request('https://officewatchparty.com/login?/signInWithGoogle', {
		method: 'POST',
		body
	});
	const url = new URL(request.url);
	const locals = { supabase: { auth: { signInWithOAuth } } };
	return { request, url, locals } as unknown as ActionEvent;
}

async function captureRedirect(event: ActionEvent): Promise<Redirect> {
	try {
		await actions.signInWithGoogle(event);
	} catch (thrown) {
		if (isRedirect(thrown)) return thrown;
		throw thrown;
	}
	throw new Error('Expected signInWithGoogle to redirect');
}

describe('login signInWithGoogle action', () => {
	it('sends the user to Google with a callback that returns them to their destination', async () => {
		const signInWithOAuth = vi.fn<SignInWithOAuth>(async () => ({
			data: { url: GOOGLE_URL },
			error: null
		}));
		const result = await captureRedirect(createActionEvent('/favorites', signInWithOAuth));

		expect(result.status).toBe(303);
		expect(result.location).toBe(GOOGLE_URL);
		expect(signInWithOAuth).toHaveBeenCalledWith({
			provider: 'google',
			options: { redirectTo: 'https://officewatchparty.com/auth/callback?redirectTo=%2Ffavorites' }
		});
	});

	it('reports a failure when Google sign-in cannot start', async () => {
		const signInWithOAuth = vi.fn<SignInWithOAuth>(async () => ({
			data: { url: null },
			error: new Error('provider is not enabled')
		}));
		const result = await actions.signInWithGoogle(createActionEvent('', signInWithOAuth));

		expect(isActionFailure(result)).toBe(true);
		expect(result).toMatchObject({ status: 500, data: { loginError: 'oauth_failed' } });
	});
});

describe('login load', () => {
	function createLoadEvent(query: string): LoadEvent {
		const url = new URL(`https://officewatchparty.com/login?${query}`);
		const safeGetSession = async (): Promise<{ user: null }> => ({ user: null });
		return { url, locals: { safeGetSession } } as unknown as LoadEvent;
	}

	it('exposes a known sign-in error', async () => {
		const data = await load(createLoadEvent('error=oauth_cancelled'));

		expect(data).toEqual({ loginError: 'oauth_cancelled' });
	});

	it('ignores an unknown sign-in error', async () => {
		const data = await load(createLoadEvent('error=anything'));

		expect(data).toEqual({ loginError: null });
	});
});
