export const LOGIN_PATH = '/login';

export const REDIRECT_PARAM = 'redirectTo';

const DEFAULT_TARGET = '/home';

// Routes that act on GET (e.g. signing out) must never be replayed after login.
const AUTH_ROUTE_PREFIX = '/auth/';

// Any fixed origin works: it only exists to tell a relative path apart from one
// that escapes to another host (e.g. `//evil.com` or `/\evil.com`).
const PLACEHOLDER_ORIGIN = 'http://placeholder.invalid';

export function buildLoginUrl(url: URL): string {
	const target = `${url.pathname}${url.search}`;
	const params = new URLSearchParams({ [REDIRECT_PARAM]: target });
	return `${LOGIN_PATH}?${params}`;
}

export function safeRedirectTarget(value: FormDataEntryValue | null): string {
	const isPath = typeof value === 'string' && value.startsWith('/');
	if (!isPath) return DEFAULT_TARGET;

	const parsed = new URL(value, PLACEHOLDER_ORIGIN);
	const isSameOrigin = parsed.origin === PLACEHOLDER_ORIGIN;
	const isLoginPage = parsed.pathname === LOGIN_PATH;
	const isAuthRoute = parsed.pathname.startsWith(AUTH_ROUTE_PREFIX);
	if (!isSameOrigin || isLoginPage || isAuthRoute) return DEFAULT_TARGET;

	return `${parsed.pathname}${parsed.search}`;
}
