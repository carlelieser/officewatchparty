import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Repos } from '$lib/server/repos';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
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
