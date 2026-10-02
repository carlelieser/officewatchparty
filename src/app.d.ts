import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Repos } from '$lib/server/repos';

export type SessionResult = {
	session: Session | null;
	user: User | null;
};

declare global {
	const __APP_VERSION__: string;

	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<SessionResult>;
			repos: Repos;
			user: User;
		}
		interface PageData {
			session: Session | null;
			user: User | null;
		}
		interface Platform {
			env: {
				VIDEOS: import('@cloudflare/workers-types').R2Bucket;
			};
			ctx: import('@cloudflare/workers-types').ExecutionContext;
			caches: import('@cloudflare/workers-types').CacheStorage & {
				default: import('@cloudflare/workers-types').Cache;
			};
		}
	}
}

export {};
