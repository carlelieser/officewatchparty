import type { SupabaseClient } from '@supabase/supabase-js';
import type { ReactionCount } from './types';

export async function roomReactionCounts(
	supabase: SupabaseClient,
	roomId: string,
	season: number,
	episode: number
): Promise<Array<ReactionCount>> {
	const { data } = await supabase.rpc('get_room_reaction_counts', {
		p_room_id: roomId,
		p_season: season,
		p_episode: episode
	});
	return data ?? [];
}

export async function roomUserReactions(
	supabase: SupabaseClient,
	roomId: string,
	season: number,
	episode: number
): Promise<Array<string>> {
	const { data } = await supabase.rpc('get_user_reactions', {
		p_room_id: roomId,
		p_season: season,
		p_episode: episode
	});
	return (data ?? []).map((row: { emoji: string }) => row.emoji);
}

export async function addReaction(alias: string, season: number, episode: number, emoji: string): Promise<void> {
	await fetch(`/api/rooms/${alias}/reactions`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ season, episode, emoji })
	});
}

export async function removeReaction(alias: string, season: number, episode: number, emoji: string): Promise<void> {
	await fetch(`/api/rooms/${alias}/reactions`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ season, episode, emoji })
	});
}
