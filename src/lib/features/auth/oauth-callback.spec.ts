import { describe, expect, it } from 'vitest';
import { buildOAuthCallbackUrl, parseOAuthCallback } from './oauth-callback';

const ORIGIN = 'https://officewatchparty.com';

function callbackUrl(query: string): URL {
	return new URL(`/auth/callback?${query}`, ORIGIN);
}

describe('buildOAuthCallbackUrl', () => {
	it('carries the destination through the provider round trip', () => {
		const url = new URL(buildOAuthCallbackUrl(ORIGIN, '/favorites'));

		expect(url.origin).toBe(ORIGIN);
		expect(url.pathname).toBe('/auth/callback');
		expect(url.searchParams.get('redirectTo')).toBe('/favorites');
	});

	it('replaces an unsafe destination with the default', () => {
		const url = new URL(buildOAuthCallbackUrl(ORIGIN, '//evil.com'));

		expect(url.searchParams.get('redirectTo')).toBe('/home');
	});
});

describe('parseOAuthCallback', () => {
	it('returns the code and destination on success', () => {
		const callback = parseOAuthCallback(callbackUrl('code=abc&redirectTo=%2Ffavorites'));

		expect(callback).toEqual({ kind: 'code', code: 'abc', target: '/favorites' });
	});

	it('reports a declined consent screen as cancelled', () => {
		const callback = parseOAuthCallback(callbackUrl('error=access_denied&redirectTo=%2Frooms'));

		expect(callback).toEqual({ kind: 'error', errorCode: 'oauth_cancelled', target: '/rooms' });
	});

	it('reports other provider errors as failed even when a code is present', () => {
		const callback = parseOAuthCallback(callbackUrl('error=server_error&code=abc'));

		expect(callback).toEqual({ kind: 'error', errorCode: 'oauth_failed', target: '/home' });
	});

	it('reports a missing code as failed', () => {
		const callback = parseOAuthCallback(callbackUrl(''));

		expect(callback).toEqual({ kind: 'error', errorCode: 'oauth_failed', target: '/home' });
	});

	it.each(['//evil.com', 'https://evil.com', '/auth/logout', '/login'])(
		'never sends the user to %s',
		(target) => {
			const query = new URLSearchParams({ code: 'abc', redirectTo: target });
			const callback = parseOAuthCallback(callbackUrl(query.toString()));

			expect(callback.target).toBe('/home');
		}
	);
});
