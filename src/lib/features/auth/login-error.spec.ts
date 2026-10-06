import { describe, expect, it } from 'vitest';
import { buildLoginErrorUrl, parseLoginError } from './login-error';

describe('parseLoginError', () => {
	it.each(['oauth_cancelled', 'oauth_failed'] as const)('accepts %s', (errorCode) => {
		expect(parseLoginError(errorCode)).toBe(errorCode);
	});

	it.each([null, '', 'toString', '<script>alert(1)</script>'])('ignores %s', (value) => {
		expect(parseLoginError(value)).toBeNull();
	});
});

describe('buildLoginErrorUrl', () => {
	it('keeps the original destination so the user can retry', () => {
		const loginUrl = new URL(buildLoginErrorUrl('oauth_failed', '/room/1?x=2'), 'http://localhost');

		expect(loginUrl.pathname).toBe('/login');
		expect(loginUrl.searchParams.get('error')).toBe('oauth_failed');
		expect(loginUrl.searchParams.get('redirectTo')).toBe('/room/1?x=2');
	});
});
