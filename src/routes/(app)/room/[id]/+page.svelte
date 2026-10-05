<script lang="ts">
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import RoomAccess from '$lib/features/rooms/components/room-access.svelte';
	import RoomPresence from '$lib/features/rooms/components/room-presence.svelte';
	import * as Comments from '$lib/features/comments';
	import { postComment } from '$lib/features/comments/api';
	import WatchLayout from '$lib/features/watch/watch-layout.svelte';
	import SyncedPlayer from '$lib/features/video/components/synced-player.svelte';
	import Reactions from '$lib/features/reactions/reactions.svelte';
	import {
		addReaction,
		removeReaction,
		roomReactionCounts,
		roomUserReactions
	} from '$lib/features/reactions/api';
	import type { Episode } from '$lib/features/episodes/types';
	import { updateEpisode, updateBingeMode, updateAutoplay } from '$lib/features/rooms/api';
	import { addFavorite, removeFavorite } from '$lib/features/favorites/api';
	import type { Favorite } from '$lib/features/favorites/types';
	import { fetchVideoUrl } from '$lib/features/video/api';
	import { findNextEpisode } from '$lib/features/episodes/next-episode';
	import { formatEpisodeCode } from '$lib/shared/format';
	import { createDonationPromptController } from '$lib/features/donations';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/state';
	import { onDestroy } from 'svelte';

	let { data } = $props();

	let episode: Episode | null = $state(data.episode);
	let videoUrl = $state(data.videoUrl);
	let bingeMode = $state(data.room.binge_mode);
	let autoplay = $state(data.room.autoplay);
	let favorites: Array<Favorite> = $state(data.favorites);
	let upNextToastId: string | number | undefined = $state(undefined);

	const episodes = $derived(page.data.episodes as Array<Episode>);
	const isFavorited = $derived.by((): boolean => {
		const current = episode;
		if (!current) return false;
		return favorites.some(
			(favorite) => favorite.season === current.season && favorite.episode === current.episode
		);
	});
	const pageTitle = $derived.by((): string => {
		const current = episode;
		if (!current) return 'Watch Party - OWP';
		return `${formatEpisodeCode(current.season, current.episode)} ${current.label} - OWP`;
	});

	let episodeChannel: RealtimeChannel | undefined;

	const donationPrompt = createDonationPromptController({
		getInitialState: () => data.donationPrompt,
		getIsOwner: () => data.isOwner,
		supportUrl: '/support'
	});

	function dismissUpNextToast(): void {
		if (upNextToastId !== undefined) {
			toast.dismiss(upNextToastId);
			upNextToastId = undefined;
		}
	}

	async function onEpisodeChange(
		selected: Episode,
		shouldAutoplay: boolean = false
	): Promise<void> {
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
			payload: { season: selected.season, episode: selected.episode, autoplay: shouldAutoplay }
		});
	}

	function handleEpisodeEnded(): void {
		if (!episode || !bingeMode) return;
		const followingEpisode = findNextEpisode(episode, episodes);
		if (followingEpisode) onEpisodeChange(followingEpisode, true);
	}

	function handleSettledPlayback(): void {
		donationPrompt.episodeWatched();
	}

	function handleNearingEnd(): void {
		if (!episode) return;
		const upcoming = findNextEpisode(episode, episodes);
		if (!upcoming) return;

		const nextLabel = `${formatEpisodeCode(upcoming.season, upcoming.episode)} — ${upcoming.label}`;
		upNextToastId = toast(nextLabel, {
			description: 'Next episode',
			duration: Infinity,
			action: {
				label: 'Watch Now',
				onClick: () => onEpisodeChange(upcoming, true)
			}
		});
	}

	function handleBingeModeChange(enabled: boolean): void {
		bingeMode = enabled;
		updateBingeMode(data.room.alias, enabled);
	}

	function handleFavoriteChange(favorited: boolean): void {
		if (!episode) return;
		const current = episode;
		if (favorited) {
			favorites = [...favorites, { season: current.season, episode: current.episode }];
			addFavorite(current.season, current.episode);
		} else {
			favorites = favorites.filter(
				(favorite) => !(favorite.season === current.season && favorite.episode === current.episode)
			);
			removeFavorite(current.season, current.episode);
		}
	}

	// Episode broadcast channel: non-owners follow the owner's episode changes.
	$effect(() => {
		episodeChannel = data.supabase.channel(`episode:${data.room.id}`);

		if (!data.isOwner) {
			episodeChannel.on(
				'broadcast',
				{ event: 'episode_change' },
				async (message: { payload: { season: number; episode: number; autoplay: boolean } }) => {
					const payload = message.payload;
					const found = episodes.find(
						(candidate) =>
							candidate.season === payload.season && candidate.episode === payload.episode
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
		donationPrompt.destroy();
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<Comments.Provider supabase={data.supabase} channelKey={data.room.id} comments={data.comments}>
	<WatchLayout
		{episode}
		selectDisabled={!data.isOwner}
		onEpisodeChange={(selected) => onEpisodeChange(selected)}
		{bingeMode}
		onBingeModeChange={handleBingeModeChange}
		favorited={isFavorited}
		onFavoriteChange={handleFavoriteChange}
	>
		{#snippet headerActions()}
			<RoomPresence supabase={data.supabase} roomId={data.room.id} />
			<RoomAccess
				alias={data.room.alias}
				room={data.room}
				members={data.members}
				isOwner={data.isOwner}
			/>
		{/snippet}

		{#snippet player()}
			<SyncedPlayer
				supabase={data.supabase}
				room={data.room}
				isOwner={data.isOwner}
				{videoUrl}
				{autoplay}
				{episode}
				onended={data.isOwner ? handleEpisodeEnded : undefined}
				onnearingend={data.isOwner ? handleNearingEnd : undefined}
				onsettledplayback={data.isOwner ? handleSettledPlayback : undefined}
			/>
		{/snippet}

		{#snippet reactions()}
			{#if episode}
				<Reactions
					supabase={data.supabase}
					channelKey={data.room.id}
					season={episode.season}
					episode={episode.episode}
					fetchCounts={(s, e) => roomReactionCounts(data.supabase, data.room.id, s, e)}
					fetchUserReactions={(s, e) => roomUserReactions(data.supabase, data.room.id, s, e)}
					onAdd={(s, e, emoji) => addReaction(data.room.alias, s, e, emoji)}
					onRemove={(s, e, emoji) => removeReaction(data.room.alias, s, e, emoji)}
				/>
			{/if}
		{/snippet}

		{#snippet comments()}
			<Comments.Input post={(content) => postComment(data.room.alias, content)} />
			<Comments.List />
		{/snippet}
	</WatchLayout>
</Comments.Provider>
