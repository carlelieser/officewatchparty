import type { SupabaseClient } from '@supabase/supabase-js';
import { createFavoritesRepo } from './favorites';
import { createRoomsRepo } from './rooms';
import { createCommentsRepo } from './comments';

export function createRepos(supabase: SupabaseClient) {
	return {
		favorites: createFavoritesRepo(supabase),
		rooms: createRoomsRepo(supabase),
		comments: createCommentsRepo(supabase)
	};
}

export type Repos = ReturnType<typeof createRepos>;
