import type { SupabaseClient } from '@supabase/supabase-js';
import type { Favorite } from '$lib/types';

export function createFavoritesRepo(supabase: SupabaseClient) {
	return {
		async findByUserId(userId: string): Promise<Favorite[]> {
			const { data, error } = await supabase
				.from('favorites')
				.select('season, episode')
				.eq('user_id', userId)
				.order('created_at');

			if (error) throw error;
			return data;
		},

		async insert(userId: string, season: number, episode: number) {
			const { error } = await supabase
				.from('favorites')
				.insert({ user_id: userId, season, episode });

			if (error) throw error;
		},

		async delete(userId: string, season: number, episode: number) {
			const { error } = await supabase
				.from('favorites')
				.delete()
				.eq('user_id', userId)
				.eq('season', season)
				.eq('episode', episode);

			if (error) throw error;
		}
	};
}
