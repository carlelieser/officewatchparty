import type { SupabaseClient } from '@supabase/supabase-js';
import type { ReactionCount } from '$lib/features/reactions/types';

export function createReactionsRepo(supabase: SupabaseClient) {
	return {
		async getCounts(roomId: string, season: number, episode: number): Promise<Array<ReactionCount>> {
			const { data, error } = await supabase.rpc('get_room_reaction_counts', {
				p_room_id: roomId,
				p_season: season,
				p_episode: episode
			});

			if (error) throw error;
			return data ?? [];
		},

		async getUserReactions(roomId: string, season: number, episode: number): Promise<Array<string>> {
			const { data, error } = await supabase.rpc('get_user_reactions', {
				p_room_id: roomId,
				p_season: season,
				p_episode: episode
			});

			if (error) throw error;
			return (data ?? []).map((row: { emoji: string }) => row.emoji);
		},

		async add(roomId: string, userId: string, season: number, episode: number, emoji: string): Promise<void> {
			const { error } = await supabase
				.from('reactions')
				.insert({ room_id: roomId, user_id: userId, season, episode, emoji });

			if (error) throw error;
		},

		async remove(roomId: string, userId: string, season: number, episode: number, emoji: string): Promise<void> {
			const { error } = await supabase
				.from('reactions')
				.delete()
				.eq('room_id', roomId)
				.eq('user_id', userId)
				.eq('season', season)
				.eq('episode', episode)
				.eq('emoji', emoji);

			if (error) throw error;
		}
	};
}
