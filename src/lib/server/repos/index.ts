import type { SupabaseClient } from '@supabase/supabase-js';
import { createFavoritesRepo } from './favorites';
import { createRoomsRepo } from './rooms';
import { createCommentsRepo } from './comments';
import { createReactionsRepo } from './reactions';
import { createDonationsRepo } from './donations';

export type Repos = {
	favorites: ReturnType<typeof createFavoritesRepo>;
	rooms: ReturnType<typeof createRoomsRepo>;
	comments: ReturnType<typeof createCommentsRepo>;
	reactions: ReturnType<typeof createReactionsRepo>;
	donations: ReturnType<typeof createDonationsRepo>;
};

export function createRepos(supabase: SupabaseClient): Repos {
	return {
		favorites: createFavoritesRepo(supabase),
		rooms: createRoomsRepo(supabase),
		comments: createCommentsRepo(supabase),
		reactions: createReactionsRepo(supabase),
		donations: createDonationsRepo(supabase)
	};
}
