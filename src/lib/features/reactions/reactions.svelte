<script lang="ts">
	import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
	import type { ReactionCount, ReactionBroadcast } from './types';
	import { addReaction, removeReaction } from './api';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { SmilePlus } from '@lucide/svelte';

	interface ReactionsProps {
		supabase: SupabaseClient;
		roomId: string;
		roomAlias: string;
		season: number;
		episode: number;
	}

	const EMOJI_GRID: Array<string> = [
		'😂', '😮', '❤️', '🔥', '👏', '😭',
		'🤣', '😍', '👀', '🙌', '💀', '😱',
		'🥳', '👎', '👍', '🤯', '😤', '🫡',
		'💯', '🎉', '😬', '🥲', '🫠', '🤩'
	];

	let { supabase, roomId, roomAlias, season, episode }: ReactionsProps = $props();

	let counts: Record<string, number> = $state({});
	let userReactions: Set<string> = $state(new Set());
	let pickerOpen = $state(false);

	const topReactions = $derived.by((): Array<ReactionCount> => {
		return Object.entries(counts)
			.map(([emoji, count]) => ({ emoji, count }))
			.filter((entry) => entry.count > 0)
			.sort((a, b) => b.count - a.count)
			.slice(0, 3);
	});

	async function fetchReactions(targetSeason: number, targetEpisode: number): Promise<void> {
		const [countsResult, userResult] = await Promise.all([
			supabase.rpc('get_room_reaction_counts', {
				p_room_id: roomId,
				p_season: targetSeason,
				p_episode: targetEpisode
			}),
			supabase.rpc('get_user_reactions', {
				p_room_id: roomId,
				p_season: targetSeason,
				p_episode: targetEpisode
			})
		]);

		counts = Object.fromEntries(
			(countsResult.data ?? []).map((entry: ReactionCount) => [entry.emoji, entry.count])
		);
		userReactions = new Set(
			(userResult.data ?? []).map((row: { emoji: string }) => row.emoji)
		);
	}

	function handleBroadcast(message: { payload: ReactionBroadcast }): void {
		const { emoji, action } = message.payload;
		const current = counts[emoji] ?? 0;
		if (action === 'add') {
			counts[emoji] = current + 1;
		} else {
			counts[emoji] = Math.max(0, current - 1);
		}
	}

	function toggleReaction(emoji: string): void {
		const hasReacted = userReactions.has(emoji);
		const current = counts[emoji] ?? 0;

		if (hasReacted) {
			userReactions.delete(emoji);
			counts[emoji] = Math.max(0, current - 1);
			removeReaction(roomAlias, season, episode, emoji);
			broadcast(emoji, 'remove');
		} else {
			userReactions.add(emoji);
			counts[emoji] = current + 1;
			addReaction(roomAlias, season, episode, emoji);
			broadcast(emoji, 'add');
		}
	}

	function broadcast(emoji: string, action: 'add' | 'remove'): void {
		channel?.send({
			type: 'broadcast',
			event: 'reaction',
			payload: { emoji, action } satisfies ReactionBroadcast
		});
	}

	function handleGridPick(emoji: string): void {
		toggleReaction(emoji);
		pickerOpen = false;
	}

	let channel: RealtimeChannel | undefined;

	// Fetch reactions when episode changes
	$effect(() => {
		fetchReactions(season, episode);
	});

	// Broadcast channel
	$effect(() => {
		channel = supabase.channel(`reactions:${roomId}`, {
			config: { broadcast: { self: false } }
		});

		channel
			.on('broadcast', { event: 'reaction' }, handleBroadcast)
			.subscribe();

		return () => {
			channel?.unsubscribe();
		};
	});
</script>

<div class="flex items-center gap-1">
	{#each topReactions as reaction (reaction.emoji)}
		<Button
			variant={userReactions.has(reaction.emoji) ? 'outline' : 'ghost'}
			size="sm"
			class="gap-1 px-2 text-sm"
			onclick={() => toggleReaction(reaction.emoji)}
		>
			<span>{reaction.emoji}</span>
			<span class="text-xs text-muted-foreground">{reaction.count}</span>
		</Button>
	{/each}
	<Popover.Root bind:open={pickerOpen}>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="icon-sm" aria-label="Add reaction">
					<SmilePlus class="size-4" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-2" align="start">
			<div class="grid grid-cols-6 gap-1">
				{#each EMOJI_GRID as emoji (emoji)}
					<button
						class="flex size-9 cursor-pointer items-center justify-center rounded-md text-lg hover:bg-accent"
						onclick={() => handleGridPick(emoji)}
					>
						{emoji}
					</button>
				{/each}
			</div>
		</Popover.Content>
	</Popover.Root>
</div>
