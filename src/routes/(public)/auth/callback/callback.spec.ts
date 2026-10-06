import { describe, expect, it, vi } from 'vitest';
import { isRedirect, type Redirect } from '@sveltejs/kit';
import { GET } from './+server';

type CallbackEvent = Parameters<typeof GET>[0];

type ExchangeResult = {
	error: Error | null;
};

type ExchangeCodeForSession = (code: string) => Promise<ExchangeResult>;

function createEvent(query: string, exchangeCodeForSession: ExchangeCodeForSession): CallbackEvent {
	const url = new URL(`http://localhost/auth/callback?${query}`);
	const locals = { supabase: { auth: { exchangeCodeForSession } } };
	return { url, locals } as unknown as CallbackEvent;
}

async function captureRedirect(event: CallbackEvent): Promise<Redirect> {
	try {
		await GET(event);
	} catch (thrown) {
		if (isRedirect(thrown)) return thrown;
		throw thrown;
	}
	throw new Error('Expected GET /auth/callback to redirect');
}

describe('GET /auth/callback', () => {
	it('signs the user in and sends them to their destination', async () => {
		const exchange = vi.fn<ExchangeCodeForSession>(async () => ({ error: null }));
		const result = await captureRedirect(createEvent('code=abc&redirectTo=%2Ffavorites', exchange));

		expect(exchange).toHaveBeenCalledWith('abc');
		expect(result.status).toBe(303);
		expect(result.location).toBe('/favorites');
	});

	it('returns to login when the code cannot be exchanged', async () => {
		const exchange = vi.fn<ExchangeCodeForSession>(async () => ({ error: new Error('bad code') }));
		const result = await captureRedirect(createEvent('code=abc&redirectTo=%2Ffavorites', exchange));

		expect(result.location).toBe('/login?error=oauth_failed&redirectTo=%2Ffavorites');
	});

	it('returns to login without exchanging when the user cancelled', async () => {
		const exchange = vi.fn<ExchangeCodeForSession>(async () => ({ error: null }));
		const result = await captureRedirect(createEvent('error=access_denied', exchange));

		expect(exchange).not.toHaveBeenCalled();
		expect(result.location).toBe('/login?error=oauth_cancelled&redirectTo=%2Fhome');
	});
});
