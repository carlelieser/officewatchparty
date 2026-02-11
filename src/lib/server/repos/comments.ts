import type { SupabaseClient } from '@supabase/supabase-js';

export function createCommentsRepo(supabase: SupabaseClient) {
	return {
		async insert(roomId: string, userId: string, content: string) {
			const { error } = await supabase
				.from('comments')
				.insert({ room_id: roomId, user_id: userId, content });

			if (error) throw error;
		}
	};
}
