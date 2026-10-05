<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { MoreVertical, Tv, Heart, HeartOff } from '@lucide/svelte';
	import { page } from '$app/state';
	import { createRoom } from '$lib/features/episodes/start-room';
	import { addFavorite, removeFavorite } from '$lib/features/favorites/api';
	import type { Episode } from '$lib/features/episodes/types';

	interface EpisodeMenuProps {
		episode: Episode;
		// When placed over the card's dark thumbnail gradient, use light styling.
		onDark?: boolean;
	}

	let { episode, onDark = false }: EpisodeMenuProps = $props();

	let triggerClass = $derived(
		onDark
			? 'rounded-full text-white opacity-70 transition-opacity hover:bg-white/20 hover:text-white hover:opacity-100'
			: 'rounded-full opacity-70 transition-opacity hover:opacity-100'
	);

	// Local optimistic state seeded from the layout-loaded favorite keys.
	let favoriteKeys = $derived((page.data.favoriteKeys as Array<string>) ?? []);
	let episodeKey = $derived(`${episode.season}-${episode.episode}`);
	let favorited = $derived(favoriteKeys.includes(episodeKey));

	function toggleFavorite(): void {
		if (favorited) {
			favorited = false;
			removeFavorite(episode.season, episode.episode);
		} else {
			favorited = true;
			addFavorite(episode.season, episode.episode);
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				size="icon-sm"
				class={triggerClass}
				aria-label="Episode options"
				onclick={(event: MouseEvent) => event.stopPropagation()}
			>
				<MoreVertical class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onSelect={() => createRoom(episode)}>
			<Tv class="size-4" />
			Create a room
		</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={toggleFavorite}>
			{#if favorited}
				<HeartOff class="size-4" />
				Remove favorite
			{:else}
				<Heart class="size-4" />
				Add favorite
			{/if}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
