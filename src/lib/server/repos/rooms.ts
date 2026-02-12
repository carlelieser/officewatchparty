import type { SupabaseClient } from '@supabase/supabase-js';
import type { Comment } from '$lib/features/comments/types';
import type { Member, Room } from '$lib/features/rooms/types';

type RoomInsert = {
	owner_id: string;
	season: number;
	episode: number;
};

type OwnedRoomRow = {
	alias: string;
	season: number;
	episode: number;
	guests: number;
};

export function createRoomsRepo(supabase: SupabaseClient) {
	return {
		async findByAlias(alias: string): Promise<Room | null> {
			const { data, error } = await supabase.from('rooms').select('*').eq('alias', alias).single();

			if (error) throw error;
			return data;
		},

		async findIdByAlias(alias: string): Promise<string | null> {
			const { data, error } = await supabase
				.from('rooms')
				.select('id')
				.eq('alias', alias)
				.single();

			if (error) throw error;
			return data?.id ?? null;
		},

		async create(ownerId: string, season: number = 1, episode: number = 1): Promise<string> {
			const insert: RoomInsert = { owner_id: ownerId, season, episode };

			const { data, error } = await supabase.from('rooms').insert(insert).select('alias').single();

			if (error || !data) throw error ?? new Error('Failed to create room');

			return data.alias;
		},

		async updateEpisode(alias: string, season: number, episode: number): Promise<void> {
			const { error } = await supabase.from('rooms').update({ season, episode }).eq('alias', alias);

			if (error) throw error;
		},

		async updateAccessType(alias: string, accessType: 'invite_only' | 'link'): Promise<void> {
			const { error } = await supabase
				.from('rooms')
				.update({ access_type: accessType })
				.eq('alias', alias);

			if (error) throw error;
		},

		async updateBingeMode(alias: string, bingeMode: boolean): Promise<void> {
			const { error } = await supabase
				.from('rooms')
				.update({ binge_mode: bingeMode })
				.eq('alias', alias);

			if (error) throw error;
		},

		async updateAutoplay(alias: string, autoplay: boolean): Promise<void> {
			const { error } = await supabase
				.from('rooms')
				.update({ autoplay })
				.eq('alias', alias);

			if (error) throw error;
		},

		async updatePlayerState(
			alias: string,
			ownerId: string,
			isPlaying: boolean,
			playerTime: number
		): Promise<void> {
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
			const { data, error } = await supabase.rpc('get_room_members', { p_room_id: roomId });

			if (error) throw error;
			return data ?? [];
		},

		async getComments(roomId: string): Promise<Array<Comment>> {
			const { data, error } = await supabase.rpc('get_room_comments', { p_room_id: roomId });

			if (error) throw error;
			return data ?? [];
		},

		async grantAccess(roomId: string, email: string): Promise<void> {
			const { error } = await supabase.rpc('grant_room_access', {
				p_room_id: roomId,
				p_email: email
			});

			if (error) throw error;
		},

		async revokeAccess(roomId: string, userId: string): Promise<void> {
			const { error } = await supabase
				.from('room_access')
				.delete()
				.eq('room_id', roomId)
				.eq('user_id', userId);

			if (error) throw error;
		},

		async findByOwnerId(ownerId: string): Promise<Array<OwnedRoomRow>> {
			const { data, error } = await supabase
				.from('rooms')
				.select('alias, season, episode, room_access(count)')
				.eq('owner_id', ownerId)
				.order('created_at', { ascending: false });

			if (error) throw error;

			const rooms = data ?? [];
			return rooms.map((room) => {
				const { room_access, ...roomFields } = room;
				return { ...roomFields, guests: room_access[0]?.count ?? 0 };
			});
		},

		async delete(alias: string, ownerId: string): Promise<void> {
			const { error } = await supabase
				.from('rooms')
				.delete()
				.eq('alias', alias)
				.eq('owner_id', ownerId);

			if (error) throw error;
		}
	};
}
