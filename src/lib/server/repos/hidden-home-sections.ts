import type { SupabaseClient } from '@supabase/supabase-js';
import type { HomeSectionKey } from '$lib/features/home-sections';

export type HiddenHomeSectionsRepo = {
	findByUserId: (userId: string) => Promise<Array<HomeSectionKey>>;
	hide: (userId: string, section: HomeSectionKey) => Promise<void>;
	show: (userId: string, section: HomeSectionKey) => Promise<void>;
};

type HiddenHomeSectionRow = {
	section: HomeSectionKey;
};

function toSectionKey(row: HiddenHomeSectionRow): HomeSectionKey {
	return row.section;
}

export function createHiddenHomeSectionsRepo(supabase: SupabaseClient): HiddenHomeSectionsRepo {
	return {
		async findByUserId(userId: string): Promise<Array<HomeSectionKey>> {
			const { data, error } = await supabase
				.from('hidden_home_sections')
				.select('section')
				.eq('user_id', userId);

			if (error) {
				throw new Error(`Failed to load hidden home sections for user ${userId}: ${error.message}`);
			}
			return data.map(toSectionKey);
		},

		async hide(userId: string, section: HomeSectionKey): Promise<void> {
			const { error } = await supabase
				.from('hidden_home_sections')
				.upsert(
					{ user_id: userId, section },
					{ onConflict: 'user_id,section', ignoreDuplicates: true }
				);

			if (error) {
				throw new Error(
					`Failed to hide home section ${section} for user ${userId}: ${error.message}`
				);
			}
		},

		async show(userId: string, section: HomeSectionKey): Promise<void> {
			const { error } = await supabase
				.from('hidden_home_sections')
				.delete()
				.eq('user_id', userId)
				.eq('section', section);

			if (error) {
				throw new Error(
					`Failed to show home section ${section} for user ${userId}: ${error.message}`
				);
			}
		}
	};
}
