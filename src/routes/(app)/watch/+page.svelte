<script lang="ts">
	import * as Comments from '$lib/features/comments';
	import WatchLayout from '$lib/features/watch/watch-layout.svelte';
	import Player from '$lib/features/video/components/player.svelte';
	import Reactions from '$lib/features/reactions/reactions.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { formatEpisodeCode } from '$lib/shared/format';
	import { addFavorite, removeFavorite } from '$lib/features/favorites/api';
	import {
		postEpisodeComment,
		addEpisodeReaction,
		removeEpisodeReaction,
		episodeReactionCounts,
		episodeUserReactions,
		saveWatchProgress
	} from '$lib/features/episodes/watch-api';
	import { findNextEpisode } from '$lib/features/episodes/next-episode';
	import { onDestroy } from 'svelte';
	import type { Episode } from '$lib/features/episodes/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const PROGRESS_SAVE_INTERVAL_SECONDS = 10;
	// Progress is bound to the episode it was captured for, so a flush that races
	// with an episode change (binge "Next", resume) never writes the old position
	// under the new episode's key.
	let tracked: { season: number; episode: number; progress: number; duration: number } | null =
		null;
	let lastSavedAt = 0;

	function flushProgress(): void {
		if (!tracked || tracked.duration <= 0) return;
		saveWatchProgress(tracked.season, tracked.episode, tracked.progress, tracked.duration);
	}

	function handleTimeUpdate(currentTime: number, duration: number): void {
		tracked = {
			season: data.episode.season,
			episode: data.episode.episode,
			progress: currentTime,
			duration
		};
		if (currentTime - lastSavedAt >= PROGRESS_SAVE_INTERVAL_SECONDS) {
			lastSavedAt = currentTime;
			flushProgress();
		}
	}

	// Reset tracking when the episode changes (the component is reused across
	// /watch navigations), so throttling restarts and no stale carryover leaks.
	$effect(() => {
		void data.episode.season;
		void data.episode.episode;
		tracked = null;
		lastSavedAt = 0;
	});

	onDestroy(flushProgress);

	// Also persist when the tab is hidden or closed, which onDestroy may miss.
	$effect(() => {
		function onPageHide(): void {
			flushProgress();
		}
		window.addEventListener('pagehide', onPageHide);
		return () => window.removeEventListener('pagehide', onPageHide);
	});

	let season = $derived(data.episode.season);
	let episodeNumber = $derived(data.episode.episode);
	let channelKey = $derived(formatEpisodeCode(season, episodeNumber));
	let pageTitle = $derived(`${data.episode.label} - OWP`);

	// Binge mode is a per-viewer preference on the watch page (no sync).
	let bingeMode = $state(true);

	const favoriteKeys = $derived((page.data.favoriteKeys as Array<string>) ?? []);
	let favorited = $derived(favoriteKeys.includes(`${season}-${episodeNumber}`));

	function goToEpisode(target: Episode): void {
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- resolve() does not accept query strings; the path is resolved
		goto(`${resolve('/watch')}?season=${target.season}&episode=${target.episode}`);
	}

	function handleEnded(): void {
		if (!bingeMode) return;
		const next = findNextEpisode(data.episode, page.data.episodes as Array<Episode>);
		if (next) goToEpisode(next);
	}

	function handleFavoriteChange(next: boolean): void {
		favorited = next;
		if (next) {
			addFavorite(season, episodeNumber);
		} else {
			removeFavorite(season, episodeNumber);
		}
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<Comments.Provider supabase={data.supabase} {channelKey} comments={data.comments}>
	<WatchLayout
		episode={data.episode}
		onEpisodeChange={goToEpisode}
		{bingeMode}
		onBingeModeChange={(enabled) => (bingeMode = enabled)}
		{favorited}
		onFavoriteChange={handleFavoriteChange}
	>
		{#snippet player()}
			<Player
				videoUrl={data.videoUrl}
				autoplay={false}
				episode={data.episode}
				startTime={data.startTime}
				ontimeupdate={handleTimeUpdate}
				onended={handleEnded}
			/>
		{/snippet}

		{#snippet reactions()}
			<Reactions
				supabase={data.supabase}
				{channelKey}
				{season}
				episode={episodeNumber}
				fetchCounts={(s, e) => episodeReactionCounts(data.supabase, s, e)}
				fetchUserReactions={(s, e) => episodeUserReactions(data.supabase, s, e)}
				onAdd={(s, e, emoji) => addEpisodeReaction(s, e, emoji)}
				onRemove={(s, e, emoji) => removeEpisodeReaction(s, e, emoji)}
			/>
		{/snippet}

		{#snippet comments()}
			<Comments.Input post={(content) => postEpisodeComment(season, episodeNumber, content)} />
			<Comments.List />
		{/snippet}
	</WatchLayout>
</Comments.Provider>
