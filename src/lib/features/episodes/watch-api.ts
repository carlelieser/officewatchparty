import type { SupabaseClient } from '@supabase/supabase-js';
import type { ReactionCount } from '$lib/features/reactions/types';

export async function postEpisodeComment(
	season: number,
	episode: number,
	content: string
): Promise<void> {
	await fetch('/api/watch/comments', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ season, episode, content })
	});
}

export async function addEpisodeReaction(
	season: number,
	episode: number,
	emoji: string
): Promise<void> {
	await fetch('/api/watch/reactions', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ season, episode, emoji })
	});
}

export async function removeEpisodeReaction(
	season: number,
	episode: number,
	emoji: string
): Promise<void> {
	await fetch('/api/watch/reactions', {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ season, episode, emoji })
	});
}

export async function saveWatchProgress(
	season: number,
	episode: number,
	progress: number,
	duration: number
): Promise<void> {
	const body = JSON.stringify({ season, episode, progress, duration });

	// Prefer sendBeacon so an in-flight save survives page unload; fall back to
	// fetch (keepalive) when it is unavailable.
	if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
		navigator.sendBeacon('/api/watch/progress', new Blob([body], { type: 'application/json' }));
		return;
	}

	await fetch('/api/watch/progress', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body,
		keepalive: true
	});
}

export async function episodeReactionCounts(
	supabase: SupabaseClient,
	season: number,
	episode: number
): Promise<Array<ReactionCount>> {
	const { data } = await supabase.rpc('get_episode_reaction_counts', {
		p_season: season,
		p_episode: episode
	});
	return data ?? [];
}

export async function episodeUserReactions(
	supabase: SupabaseClient,
	season: number,
	episode: number
): Promise<Array<string>> {
	const { data } = await supabase.rpc('get_user_episode_reactions', {
		p_season: season,
		p_episode: episode
	});
	return (data ?? []).map((row: { emoji: string }) => row.emoji);
}
