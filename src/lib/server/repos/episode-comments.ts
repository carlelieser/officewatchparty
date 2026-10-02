import type { SupabaseClient } from '@supabase/supabase-js';
import type { Comment } from '$lib/features/comments/types';

export function createEpisodeCommentsRepo(supabase: SupabaseClient) {
	return {
		async list(season: number, episode: number): Promise<Array<Comment>> {
			const { data, error } = await supabase.rpc('get_episode_comments', {
				p_season: season,
				p_episode: episode
			});

			if (error) throw error;
			return data ?? [];
		},

		async insert(season: number, episode: number, userId: string, content: string): Promise<void> {
			const { error } = await supabase
				.from('episode_comments')
				.insert({ season, episode, user_id: userId, content });

			if (error) throw error;
		}
	};
}
