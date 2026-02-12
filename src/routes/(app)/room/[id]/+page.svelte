<script lang="ts">
	import type {RealtimeChannel} from '@supabase/supabase-js';
	import RoomAccess from '$lib/features/rooms/components/room-access.svelte';
	import RoomPresence from '$lib/features/rooms/components/room-presence.svelte';
	import * as Comments from '$lib/features/comments';
	import OfficeEpisodeSelect from '$lib/features/episodes/components/office-episode-select.svelte';
	import VideoPlayer from '$lib/features/video/components/video-player.svelte';
	import BingeModeToggle from '$lib/features/video/components/binge-mode-toggle.svelte';
	import FavoriteToggle from '$lib/features/favorites/components/favorite-toggle.svelte';
	import Reactions from '$lib/features/reactions/reactions.svelte';
	import {Button} from '$lib/components/ui/button';
	import {SkipBack, SkipForward} from '@lucide/svelte';
	import type {Episode} from '$lib/features/episodes/types';
	import {updateEpisode, updateBingeMode, updateAutoplay} from '$lib/features/rooms/api';
	import {addFavorite, removeFavorite} from '$lib/features/favorites/api';
	import type {Favorite} from '$lib/features/favorites/types';
	import {fetchVideoUrl} from '$lib/features/video/api';
	import {findNextEpisode, findPreviousEpisode} from '$lib/features/episodes/next-episode';
	import {formatEpisodeCode} from '$lib/shared/format';
	import {toast} from 'svelte-sonner';
	import {page} from '$app/state';
	import {onDestroy} from 'svelte';

	let {data} = $props();

	let episode: Episode | null = $state(data.episode);
	let videoUrl = $state(data.videoUrl);
	let bingeMode = $state(data.room.binge_mode);
	let autoplay = $state(data.room.autoplay);
	let favorites: Array<Favorite> = $state(data.favorites);
	let upNextToastId: string | number | undefined = $state(undefined);

	const episodes = $derived(page.data.episodes as Array<Episode>);
	const previousEpisode = $derived(episode ? findPreviousEpisode(episode, episodes) : null);
	const nextEpisode = $derived(episode ? findNextEpisode(episode, episodes) : null);
	const isFavorited = $derived.by((): boolean => {
		const current = episode;
		if (!current) return false;
		return favorites.some(
			(favorite) => favorite.season === current.season && favorite.episode === current.episode
		);
	});

	let episodeChannel: RealtimeChannel | undefined;

	function dismissUpNextToast(): void {
		if (upNextToastId !== undefined) {
			toast.dismiss(upNextToastId);
			upNextToastId = undefined;
		}
	}

	async function onEpisodeChange(selected: Episode, shouldAutoplay: boolean = false): Promise<void> {
		dismissUpNextToast();
		episode = selected;

		if (shouldAutoplay) {
			autoplay = true;
			updateAutoplay(data.room.alias, true);
		}

		updateEpisode(data.room.alias, selected.season, selected.episode);
		videoUrl = await fetchVideoUrl(selected.season, selected.episode);

		episodeChannel?.send({
			type: 'broadcast',
			event: 'episode_change',
			payload: {season: selected.season, episode: selected.episode, autoplay: shouldAutoplay}
		});
	}

	function handleEpisodeEnded(): void {
		if (!bingeMode || !episode) return;
		const nextEpisode = findNextEpisode(episode, episodes);
		if (!nextEpisode) return;
		onEpisodeChange(nextEpisode, true);
	}

	function handleNearingEnd(): void {
		if (!episode) return;
		const nextEpisode = findNextEpisode(episode, episodes);
		if (!nextEpisode) return;

		const nextLabel = `${formatEpisodeCode(nextEpisode.season, nextEpisode.episode)} — ${nextEpisode.label}`;

		upNextToastId = toast(nextLabel, {
			description: "Next episode",
			duration: Infinity,
			action: {
				label: 'Watch Now',
				onClick: () => {
					onEpisodeChange(nextEpisode, true);
				}
			}
		});
	}

	function handlePlayPrevious(): void {
		if (!previousEpisode) return;
		onEpisodeChange(previousEpisode, true);
	}

	function handlePlayNext(): void {
		if (!nextEpisode) return;
		onEpisodeChange(nextEpisode, true);
	}

	function handleBingeModeChange(enabled: boolean): void {
		bingeMode = enabled;
		updateBingeMode(data.room.alias, enabled);
	}

	function handleFavoriteChange(favorited: boolean): void {
		if (!episode) return;

		if (favorited) {
			favorites = [...favorites, {season: episode.season, episode: episode.episode}];
			addFavorite(episode.season, episode.episode);
		} else {
			favorites = favorites.filter(
				(favorite) => !(favorite.season === episode!.season && favorite.episode === episode!.episode)
			);
			removeFavorite(episode.season, episode.episode);
		}
	}

	// Episode broadcast channel
	$effect(() => {
		episodeChannel = data.supabase.channel(`episode:${data.room.id}`);

		if (!data.isOwner) {
			episodeChannel.on(
				'broadcast',
				{event: 'episode_change'},
				async (message: { payload: { season: number; episode: number; autoplay: boolean } }) => {
					const payload = message.payload;
					const found = episodes.find(
						(candidate) => candidate.season === payload.season && candidate.episode === payload.episode
					);
					if (!found) return;

					episode = found;
					autoplay = payload.autoplay;
					videoUrl = await fetchVideoUrl(payload.season, payload.episode);
				}
			);
		}

		episodeChannel.subscribe();

		return () => {
			episodeChannel?.unsubscribe();
		};
	});

	onDestroy(() => {
		dismissUpNextToast();
	});
</script>

<Comments.Provider supabase={data.supabase} roomId={data.room.id} comments={data.comments}>
	<div class="size-full p-2">
		<div class="max-w-screen-xl mx-auto size-full flex flex-col">
			<div class="p-4 flex items-center justify-between">
				<div class="flex items-center gap-2 min-w-0 max-w-full">
					<OfficeEpisodeSelect
							bind:selected={episode}
							onchange={(selected) => onEpisodeChange(selected)}
							disabled={!data.isOwner}
							class="flex-1 shrink"
					/>
				</div>
				<div class="ml-4 flex items-center gap-2">
					<RoomPresence supabase={data.supabase} roomId={data.room.id}/>
					<RoomAccess
							alias={data.room.alias}
							room={data.room}
							members={data.members}
							isOwner={data.isOwner}
					/>
					{#if data.isOwner}
						<BingeModeToggle enabled={bingeMode} onchange={handleBingeModeChange}/>
					{/if}
				</div>
			</div>
			<div class="px-4">
				<div class="bg-black rounded-2xl overflow-hidden aspect-square md:aspect-video">
					<VideoPlayer
							supabase={data.supabase}
							room={data.room}
							isOwner={data.isOwner}
							{videoUrl}
							{autoplay}
							onended={data.isOwner ? handleEpisodeEnded : undefined}
							onnearingend={data.isOwner ? handleNearingEnd : undefined}
					/>
				</div>
			</div>
			<div class="px-4 mt-4 flex items-center justify-between gap-2">
				<div class="flex items-center gap-2">
					<FavoriteToggle
							favorited={isFavorited}
							onchange={handleFavoriteChange}
							disabled={!episode}
					/>
					{#if episode}
						<Reactions
								supabase={data.supabase}
								roomId={data.room.id}
								roomAlias={data.room.alias}
								season={episode.season}
								episode={episode.episode}
						/>
					{/if}
				</div>
				{#if data.isOwner}
					<div class="flex items-center gap-2">
						<Button
								variant="outline"
								size="sm"
								disabled={!previousEpisode}
								onclick={handlePlayPrevious}
								aria-label="Previous Episode"
						>
							<SkipBack/>
							<span class="text-sm">Previous</span>
						</Button>
						<Button
								variant="outline"
								size="sm"
								disabled={!nextEpisode}
								onclick={handlePlayNext}
								aria-label="Next Episode"
						>
							<SkipForward/>
							<span class="text-sm">Next</span>
						</Button>
					</div>
				{/if}
			</div>
			<Comments.Header class="px-4 mt-4 top-18 py-4 pt-6"/>
			<Comments.Root class="flex-1 min-h-0 py-4">
				<Comments.Input roomAlias={data.room.alias}/>
				<Comments.List/>
			</Comments.Root>
		</div>
	</div>
</Comments.Provider>
