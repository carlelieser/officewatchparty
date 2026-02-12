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
	}
}

export {};
