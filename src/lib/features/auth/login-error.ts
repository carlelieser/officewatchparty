import { LOGIN_PATH, REDIRECT_PARAM } from './redirect-target';

export type LoginErrorCode = 'oauth_cancelled' | 'oauth_failed';

export const LOGIN_ERROR_PARAM = 'error';

export const LOGIN_ERROR_MESSAGES: Record<LoginErrorCode, string> = {
	oauth_cancelled: 'Google sign-in was cancelled.',
	oauth_failed: 'Google sign-in failed. Please try again.'
};

function isLoginErrorCode(value: string): value is LoginErrorCode {
	return Object.hasOwn(LOGIN_ERROR_MESSAGES, value);
}

export function parseLoginError(value: string | null): LoginErrorCode | null {
	if (value === null || !isLoginErrorCode(value)) return null;
	return value;
}

export function buildLoginErrorUrl(errorCode: LoginErrorCode, target: string): string {
	const params = new URLSearchParams({ [LOGIN_ERROR_PARAM]: errorCode, [REDIRECT_PARAM]: target });
	return `${LOGIN_PATH}?${params}`;
}
