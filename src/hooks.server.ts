import { createServerClient } from '@supabase/ssr';
import { error, redirect, type Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createRepos } from '$lib/server/repos';
import type { SessionResult } from './app.d.ts';

type CookieToSet = {
	name: string;
	value: string;
	options: Record<string, unknown>;
};

function setAllCookies(cookiesToSet: Array<CookieToSet>, event: Parameters<Handle>[0]['event']): void {
	cookiesToSet.forEach(({ name, value, options }) => {
		event.cookies.set(name, value, { ...options, path: '/' });
	});
}

function isAllowedResponseHeader(name: string): boolean {
	return name === 'content-range' || name === 'x-supabase-api-version';
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => setAllCookies(cookiesToSet, event)
		}
	});

	event.locals.safeGetSession = async (): Promise<SessionResult> => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error: authError
		} = await event.locals.supabase.auth.getUser();

		if (authError) {
			return { session: null, user: null };
		}

		return { session, user };
	};

	event.locals.repos = createRepos(event.locals.supabase);

	if (event.route.id?.startsWith('/(app)')) {
		const { user } = await event.locals.safeGetSession();

		if (!user) {
			if (event.route.id.includes('/api/')) {
				error(401, 'Unauthorized');
			}
			redirect(303, '/login');
		}

		event.locals.user = user;
	}

	return resolve(event, {
		filterSerializedResponseHeaders: isAllowedResponseHeader
	});
};
