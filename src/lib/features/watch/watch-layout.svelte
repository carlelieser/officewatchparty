<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Comments from '$lib/features/comments';
	import OfficeEpisodeSelect from '$lib/features/episodes/components/office-episode-select.svelte';
	import BingeModeToggle from '$lib/features/video/components/binge-mode-toggle.svelte';
	import FavoriteToggle from '$lib/features/favorites/components/favorite-toggle.svelte';
	import { Button } from '$lib/components/ui/button';
	import { SkipBack, SkipForward } from '@lucide/svelte';
	import { findNextEpisode, findPreviousEpisode } from '$lib/features/episodes/next-episode';
	import { page } from '$app/state';
	import type { Episode } from '$lib/features/episodes/types';

	interface WatchLayoutProps {
		episode: Episode | null;
		selectDisabled?: boolean;
		onEpisodeChange: (episode: Episode) => void;
		bingeMode: boolean;
		onBingeModeChange: (enabled: boolean) => void;
		favorited: boolean;
		onFavoriteChange: (favorited: boolean) => void;
		player: Snippet;
		comments: Snippet;
		reactions?: Snippet;
		headerActions?: Snippet;
	}

	let {
		episode,
		selectDisabled = false,
		onEpisodeChange,
		bingeMode,
		onBingeModeChange,
		favorited,
		onFavoriteChange,
		player,
		comments,
		reactions,
		headerActions
	}: WatchLayoutProps = $props();

	let selected = $state(episode);
	$effect(() => {
		selected = episode;
	});

	const episodes = $derived(page.data.episodes as Array<Episode>);
	const previousEpisode = $derived(episode ? findPreviousEpisode(episode, episodes) : null);
	const nextEpisode = $derived(episode ? findNextEpisode(episode, episodes) : null);

	function playPrevious(): void {
		if (previousEpisode) onEpisodeChange(previousEpisode);
	}

	function playNext(): void {
		if (nextEpisode) onEpisodeChange(nextEpisode);
	}
</script>

<div class="size-full p-2">
	<div class="max-w-screen-xl mx-auto size-full flex flex-col">
		<div class="p-4 flex items-center justify-between">
			<div class="flex items-center gap-2 min-w-0 max-w-full">
				<OfficeEpisodeSelect
					bind:selected
					onchange={onEpisodeChange}
					disabled={selectDisabled}
					class="flex-1 shrink"
				/>
			</div>
			<div class="ml-4 flex items-center gap-2">
				{@render headerActions?.()}
				<BingeModeToggle enabled={bingeMode} onchange={onBingeModeChange} />
			</div>
		</div>

		<div class="px-4">
			<div class="bg-black rounded-2xl overflow-hidden aspect-square md:aspect-video">
				{@render player()}
			</div>
		</div>

		<div class="px-4 mt-4 flex items-center justify-between gap-2">
			<div class="flex items-center gap-2">
				<FavoriteToggle {favorited} onchange={onFavoriteChange} disabled={!episode} />
				{@render reactions?.()}
			</div>
			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={!previousEpisode}
					onclick={playPrevious}
					aria-label="Previous Episode"
				>
					<SkipBack />
					<span class="text-sm">Previous</span>
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={!nextEpisode}
					onclick={playNext}
					aria-label="Next Episode"
				>
					<SkipForward />
					<span class="text-sm">Next</span>
				</Button>
			</div>
		</div>

		<Comments.Header class="px-4 mt-4 top-18 py-4 pt-6" />
		<Comments.Root class="flex-1 min-h-0 py-4">
			{@render comments()}
		</Comments.Root>
	</div>
</div>
