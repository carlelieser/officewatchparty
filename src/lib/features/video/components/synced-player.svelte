<script lang="ts">
	import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
	import type { Room } from '$lib/features/rooms/types';
	import type { Episode } from '$lib/features/episodes/types';
	import Player, { type PlayerHandle } from './player.svelte';
	import { updatePlayerState } from '$lib/features/rooms/api';

	interface SyncedPlayerProps {
		supabase: SupabaseClient;
		room: Room;
		isOwner: boolean;
		videoUrl: string;
		autoplay: boolean;
		episode: Episode | null;
		onended?: () => void;
		onnearingend?: () => void;
		onsettledplayback?: () => void;
	}

	let {
		supabase,
		room,
		isOwner,
		videoUrl,
		autoplay,
		episode,
		onended,
		onnearingend,
		onsettledplayback
	}: SyncedPlayerProps = $props();

	const SETTLED_PLAYBACK_SECONDS = 150;

	let handle: PlayerHandle | undefined = $state();
	let syncing = false;
	let playerChannel: RealtimeChannel | undefined;
	let nearingEndFired = false;
	let settledPlaybackFired = false;
	let hasCaughtUp = false;

	function broadcastState(isPlaying: boolean, time: number): void {
		playerChannel?.send({
			type: 'broadcast',
			event: 'player_state',
			payload: { is_playing: isPlaying, time }
		});
	}

	function persistState(isPlaying: boolean, time: number): void {
		updatePlayerState(room.alias, isPlaying, time);
	}

	function syncPlaybackChange(isPlaying: boolean): void {
		if (syncing || !isOwner || !handle) return;
		const time = handle.getCurrentTime();
		broadcastState(isPlaying, time);
		persistState(isPlaying, time);
	}

	function handlePlay(): void {
		syncPlaybackChange(true);
	}

	function handlePause(): void {
		syncPlaybackChange(false);
	}

	function handleSeeked(): void {
		if (syncing || !isOwner || !handle) return;
		const time = handle.getCurrentTime();
		broadcastState(!handle.isPaused(), time);
		persistState(!handle.isPaused(), time);
	}

	function handleTimeUpdate(currentTime: number, duration: number): void {
		if (!isOwner) return;

		if (!settledPlaybackFired && currentTime >= SETTLED_PLAYBACK_SECONDS) {
			settledPlaybackFired = true;
			onsettledplayback?.();
		}

		if (nearingEndFired) return;
		if (duration > 0 && duration - currentTime <= 35) {
			nearingEndFired = true;
			onnearingend?.();
		}
	}

	function handleEnded(): void {
		if (isOwner) onended?.();
	}

	function applyState(isPlaying: boolean, time: number): void {
		if (!handle) return;
		syncing = true;
		handle.seek(time);
		if (isPlaying) {
			handle.play();
		} else {
			handle.pause();
		}
		setTimeout(() => {
			syncing = false;
		}, 500);
	}

	function handleLoadedMetadata(): void {
		// Non-owners catch up to the room's snapshot only once, at mount. The
		// snapshot goes stale after live episode/playback changes, which are
		// instead corrected by the owner's player_state broadcasts.
		if (isOwner || !handle || hasCaughtUp) return;
		hasCaughtUp = true;

		let time = room.player_time ?? 0;
		if (room.is_playing && room.player_updated_at) {
			const updatedAtTimestamp = new Date(room.player_updated_at).getTime();
			const elapsedSeconds = (Date.now() - updatedAtTimestamp) / 1000;
			time += elapsedSeconds;
		}
		syncing = true;
		handle.seek(time);
		if (room.is_playing) handle.play();
		setTimeout(() => {
			syncing = false;
		}, 500);
	}

	// Reset the one-shot playback flags whenever the source changes.
	$effect(() => {
		void videoUrl;
		nearingEndFired = false;
		settledPlaybackFired = false;
	});

	// Player sync channel: non-owners receive owner playback state.
	$effect(() => {
		playerChannel = supabase.channel(`player:${room.id}`);

		if (!isOwner) {
			playerChannel.on(
				'broadcast',
				{ event: 'player_state' },
				(message: { payload: { is_playing: boolean; time: number } }) => {
					applyState(message.payload.is_playing, message.payload.time);
				}
			);
		}

		playerChannel.subscribe();

		return () => {
			playerChannel?.unsubscribe();
		};
	});
</script>

<Player
	{videoUrl}
	{autoplay}
	{episode}
	controls={isOwner}
	bind:handle
	onplay={handlePlay}
	onpause={handlePause}
	onseeked={handleSeeked}
	ontimeupdate={handleTimeUpdate}
	onended={handleEnded}
	onloadedmetadata={handleLoadedMetadata}
/>
