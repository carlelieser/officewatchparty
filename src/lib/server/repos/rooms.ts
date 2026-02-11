import type { SupabaseClient } from '@supabase/supabase-js';
import type { Comment, Member, Room } from '$lib/types';

export function createRoomsRepo(supabase: SupabaseClient) {
	return {
		async findByAlias(alias: string) {
			const { data } = await supabase.from('rooms').select('*').eq('alias', alias).single();

			return data;
		},

		async findIdByAlias(alias: string) {
			const { data } = await supabase.from('rooms').select('id').eq('alias', alias).single();

			return data?.id as string | null;
		},

		async create(ownerId: string, season: number = 1, episode: number = 1) {
			const insert: Record<string, unknown> = { owner_id: ownerId, season, episode };

			const { data, error } = await supabase.from('rooms').insert(insert).select('alias').single();

			console.log(error);

			if (error || !data) throw error ?? new Error('Failed to create room');

			return data.alias as string;
		},

		async updateEpisode(alias: string, season: number, episode: number) {
			const { error } = await supabase.from('rooms').update({ season, episode }).eq('alias', alias);

			if (error) throw error;
		},

		async updateAccessType(alias: string, accessType: 'invite_only' | 'link') {
			const { error } = await supabase
				.from('rooms')
				.update({ access_type: accessType })
				.eq('alias', alias);

			if (error) throw error;
		},

		async updatePlayerState(
			alias: string,
			ownerId: string,
			isPlaying: boolean,
			playerTime: number
		) {
			const { error } = await supabase
				.from('rooms')
				.update({
					is_playing: isPlaying,
					player_time: playerTime,
					player_updated_at: new Date().toISOString()
				})
				.eq('alias', alias)
				.eq('owner_id', ownerId);

			if (error) throw error;
		},

		async getMembers(roomId: string): Promise<Array<Member>> {
			const { data } = await supabase.rpc('get_room_members', { p_room_id: roomId });
			return data || [];
		},

		async getComments(roomId: string): Promise<Array<Comment>> {
			const { data } = await supabase.rpc('get_room_comments', { p_room_id: roomId });
			return data || [];
		},

		async grantAccess(roomId: string, email: string) {
			const { error } = await supabase.rpc('grant_room_access', {
				p_room_id: roomId,
				p_email: email
			});

			if (error) throw error;
		},

		async revokeAccess(roomId: string, userId: string) {
			const { error } = await supabase
				.from('room_access')
				.delete()
				.eq('room_id', roomId)
				.eq('user_id', userId);

			if (error) throw error;
		},

		async findByOwnerId(ownerId: string) {
			const { data } = await supabase
				.from('rooms')
				.select('alias, season, episode, room_access(count)')
				.eq('owner_id', ownerId)
				.order('created_at', { ascending: false });

			const rooms = data ?? [];
			return rooms.map((room) => {
				const { room_access, ...rest } = room;
				return { ...rest, guests: room_access[0]?.count ?? 0 };
			});
		},

		async delete(alias: string, ownerId: string) {
			const { error } = await supabase
				.from('rooms')
				.delete()
				.eq('alias', alias)
				.eq('owner_id', ownerId);

			if (error) throw error;
		}
	};
}
