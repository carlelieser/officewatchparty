import type { SupabaseClient } from '@supabase/supabase-js';
import type { DonationPromptState } from '$lib/features/donations/types';

const EMPTY_STATE: DonationPromptState = {
	episodes_completed: 0,
	dismissed_count: 0,
	last_dismissed_at: null,
	donated_at: null
};

const STATE_COLUMNS = 'episodes_completed, dismissed_count, last_dismissed_at, donated_at';

export function createDonationsRepo(supabase: SupabaseClient) {
	async function findByUserId(userId: string): Promise<DonationPromptState> {
		const { data, error } = await supabase
			.from('donation_prompts')
			.select(STATE_COLUMNS)
			.eq('user_id', userId)
			.maybeSingle();

		if (error) throw error;
		if (!data) return EMPTY_STATE;

		return data as DonationPromptState;
	}

	return {
		findByUserId,

		async recordEpisodeCompleted(userId: string): Promise<DonationPromptState> {
			const current = await findByUserId(userId);
			const next: DonationPromptState = {
				...current,
				episodes_completed: current.episodes_completed + 1
			};

			const { error } = await supabase
				.from('donation_prompts')
				.upsert({ user_id: userId, ...next }, { onConflict: 'user_id' });

			if (error) throw error;
			return next;
		},

		async recordDismissal(userId: string): Promise<void> {
			const current = await findByUserId(userId);
			const dismissedAt = new Date().toISOString();

			const { error } = await supabase.from('donation_prompts').upsert(
				{
					user_id: userId,
					...current,
					dismissed_count: current.dismissed_count + 1,
					last_dismissed_at: dismissedAt
				},
				{ onConflict: 'user_id' }
			);

			if (error) throw error;
		},

		async recordDonation(userId: string): Promise<void> {
			const current = await findByUserId(userId);
			const donatedAt = new Date().toISOString();

			const { error } = await supabase
				.from('donation_prompts')
				.upsert({ user_id: userId, ...current, donated_at: donatedAt }, { onConflict: 'user_id' });

			if (error) throw error;
		}
	};
}
