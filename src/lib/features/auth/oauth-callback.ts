import type { LoginErrorCode } from './login-error';
import { REDIRECT_PARAM, safeRedirectTarget } from './redirect-target';

export const OAUTH_CALLBACK_PATH = '/auth/callback';

// Sent by the provider when the user declines the consent screen.
const ACCESS_DENIED = 'access_denied';

type OAuthCodeResult = {
	kind: 'code';
	code: string;
	target: string;
};

type OAuthErrorResult = {
	kind: 'error';
	errorCode: LoginErrorCode;
	target: string;
};

export type OAuthCallbackParams = OAuthCodeResult | OAuthErrorResult;

export function buildOAuthCallbackUrl(origin: string, target: string): string {
	const callbackUrl = new URL(OAUTH_CALLBACK_PATH, origin);
	callbackUrl.searchParams.set(REDIRECT_PARAM, safeRedirectTarget(target));
	return callbackUrl.toString();
}

export function parseOAuthCallback(url: URL): OAuthCallbackParams {
	const target = safeRedirectTarget(url.searchParams.get(REDIRECT_PARAM));
	const providerError = url.searchParams.get('error');
	const code = url.searchParams.get('code');

	if (providerError === ACCESS_DENIED)
		return { kind: 'error', errorCode: 'oauth_cancelled', target };
	if (providerError !== null || !code) return { kind: 'error', errorCode: 'oauth_failed', target };

	return { kind: 'code', code, target };
}
