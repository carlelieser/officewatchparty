import type { SupabaseClient } from '@supabase/supabase-js';
import { createFavoritesRepo } from './favorites';
import { createRoomsRepo } from './rooms';
import { createCommentsRepo } from './comments';
import { createReactionsRepo } from './reactions';
import { createEpisodeCommentsRepo } from './episode-comments';
import { createEpisodeReactionsRepo } from './episode-reactions';
import { createWatchHistoryRepo } from './watch-history';
import { createDonationsRepo } from './donations';

export type Repos = {
	favorites: ReturnType<typeof createFavoritesRepo>;
	rooms: ReturnType<typeof createRoomsRepo>;
	comments: ReturnType<typeof createCommentsRepo>;
	reactions: ReturnType<typeof createReactionsRepo>;
	episodeComments: ReturnType<typeof createEpisodeCommentsRepo>;
	episodeReactions: ReturnType<typeof createEpisodeReactionsRepo>;
	watchHistory: ReturnType<typeof createWatchHistoryRepo>;
	donations: ReturnType<typeof createDonationsRepo>;
};

export function createRepos(supabase: SupabaseClient): Repos {
	return {
		favorites: createFavoritesRepo(supabase),
		rooms: createRoomsRepo(supabase),
		comments: createCommentsRepo(supabase),
		reactions: createReactionsRepo(supabase),
		episodeComments: createEpisodeCommentsRepo(supabase),
		episodeReactions: createEpisodeReactionsRepo(supabase),
		watchHistory: createWatchHistoryRepo(supabase),
		donations: createDonationsRepo(supabase)
	};
}
