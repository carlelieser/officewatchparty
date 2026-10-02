import type { SupabaseClient } from '@supabase/supabase-js';

export type WatchHistoryEntry = {
	season: number;
	episode: number;
	progress_seconds: number;
	duration_seconds: number;
};

// Only surface episodes that are meaningfully in-progress: past the opening and
// not essentially finished.
const CONTINUE_MIN_RATIO = 0.05;
const CONTINUE_MAX_RATIO = 0.95;

export function createWatchHistoryRepo(supabase: SupabaseClient) {
	return {
		async record(userId: string, season: number, episode: number): Promise<void> {
			const { error } = await supabase
				.from('watch_history')
				.upsert(
					{ user_id: userId, season, episode, last_watched_at: new Date().toISOString() },
					{ onConflict: 'user_id,season,episode' }
				);

			if (error) throw error;
		},

		async saveProgress(
			userId: string,
			season: number,
			episode: number,
			progressSeconds: number,
			durationSeconds: number
		): Promise<void> {
			const { error } = await supabase.from('watch_history').upsert(
				{
					user_id: userId,
					season,
					episode,
					progress_seconds: progressSeconds,
					duration_seconds: durationSeconds,
					last_watched_at: new Date().toISOString()
				},
				{ onConflict: 'user_id,season,episode' }
			);

			if (error) throw error;
		},

		async findLatest(userId: string): Promise<WatchHistoryEntry | null> {
			const { data, error } = await supabase
				.from('watch_history')
				.select('season, episode, progress_seconds, duration_seconds')
				.eq('user_id', userId)
				.order('last_watched_at', { ascending: false })
				.limit(1)
				.maybeSingle();

			if (error) throw error;
			return data ?? null;
		},

		async findContinueWatching(userId: string, limit = 12): Promise<Array<WatchHistoryEntry>> {
			const { data, error } = await supabase
				.from('watch_history')
				.select('season, episode, progress_seconds, duration_seconds')
				.eq('user_id', userId)
				.gt('duration_seconds', 0)
				.order('last_watched_at', { ascending: false })
				.limit(50);

			if (error) throw error;

			return (data ?? [])
				.filter((entry) => {
					const ratio = entry.progress_seconds / entry.duration_seconds;
					return ratio >= CONTINUE_MIN_RATIO && ratio <= CONTINUE_MAX_RATIO;
				})
				.slice(0, limit);
		}
	};
}
