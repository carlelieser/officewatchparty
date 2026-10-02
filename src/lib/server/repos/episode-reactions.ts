import type { SupabaseClient } from '@supabase/supabase-js';
import type { ReactionCount } from '$lib/features/reactions/types';

export function createEpisodeReactionsRepo(supabase: SupabaseClient) {
	return {
		async getCounts(season: number, episode: number): Promise<Array<ReactionCount>> {
			const { data, error } = await supabase.rpc('get_episode_reaction_counts', {
				p_season: season,
				p_episode: episode
			});

			if (error) throw error;
			return data ?? [];
		},

		async getUserReactions(season: number, episode: number): Promise<Array<string>> {
			const { data, error } = await supabase.rpc('get_user_episode_reactions', {
				p_season: season,
				p_episode: episode
			});

			if (error) throw error;
			return (data ?? []).map((row: { emoji: string }) => row.emoji);
		},

		async add(season: number, episode: number, userId: string, emoji: string): Promise<void> {
			const { error } = await supabase
				.from('episode_reactions')
				.insert({ season, episode, user_id: userId, emoji });

			if (error) throw error;
		},

		async remove(season: number, episode: number, userId: string, emoji: string): Promise<void> {
			const { error } = await supabase
				.from('episode_reactions')
				.delete()
				.eq('season', season)
				.eq('episode', episode)
				.eq('user_id', userId)
				.eq('emoji', emoji);

			if (error) throw error;
		}
	};
}
