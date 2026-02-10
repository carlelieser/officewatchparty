<script lang="ts">
	import RoomAccess from '$lib/components/room-access.svelte';
	import RoomPresence from '$lib/components/room-presence.svelte';
	import Comments from '$lib/components/comments.svelte';
	import OfficeEpisodeSelect from '$lib/components/office-episode-select.svelte';
	import type { Episode } from '$lib/components/episode-select.svelte';
	import videojs from 'video.js';
	import type Player from 'video.js/dist/types/player';
	import 'video.js/dist/video-js.css';
	import type { RealtimeChannel } from '@supabase/supabase-js';

	let { data } = $props();
	let episode: Episode | null = $state(data ? data.episode : null);
	let videoUrl = $derived(episode ? `/season/${episode.season}/episode/${episode.episode}` : '');

	let videoEl: HTMLVideoElement;
	let player: Player;
	let syncing = false;
	let playerChannel: RealtimeChannel | undefined;

	function onEpisodeChange(ep: Episode) {
		const body = new FormData();
		body.set('season', String(ep.season));
		body.set('episode', String(ep.episode));
		fetch('?/episode', { method: 'POST', body });
	}

	function broadcastState(isPlaying: boolean, time: number) {
		playerChannel?.send({
			type: 'broadcast',
			event: 'player_state',
			payload: { is_playing: isPlaying, time }
		});
	}

	function persistState(isPlaying: boolean, time: number) {
		const body = new FormData();
		body.set('is_playing', String(isPlaying));
		body.set('player_time', String(time));
		fetch('?/player', { method: 'POST', body });
	}

	function handleOwnerPlay() {
		if (syncing) return;
		const time = player.currentTime() ?? 0;
		broadcastState(true, time);
		persistState(true, time);
	}

	function handleOwnerPause() {
		if (syncing) return;
		const time = player.currentTime() ?? 0;
		broadcastState(false, time);
		persistState(false, time);
	}

	function handleOwnerSeeked() {
		if (syncing) return;
		const time = player.currentTime() ?? 0;
		const isPlaying = !player.paused();
		broadcastState(isPlaying, time);
		persistState(isPlaying, time);
	}

	function applyState(isPlaying: boolean, time: number) {
		syncing = true;
		player.currentTime(time);
		if (isPlaying) {
			player.play();
		} else {
			player.pause();
		}
		// Reset syncing flag after a short delay to let events settle
		setTimeout(() => {
			syncing = false;
		}, 500);
	}

	// Initialize player
	$effect(() => {
		const isOwner = data.isOwner;

		player = videojs(videoEl, {
			controls: isOwner,
			fluid: true,
			preload: 'auto'
		});

		if (isOwner) {
			player.on('play', handleOwnerPlay);
			player.on('pause', handleOwnerPause);
			player.on('seeked', handleOwnerSeeked);
		}

		// Apply initial player state for non-owners
		if (!isOwner && data.room) {
			player.one('loadedmetadata', () => {
				let time = data.room.player_time ?? 0;
				if (data.room.is_playing && data.room.player_updated_at) {
					const elapsed = (Date.now() - new Date(data.room.player_updated_at).getTime()) / 1000;
					time += elapsed;
				}
				syncing = true;
				player.currentTime(time);
				if (data.room.is_playing) {
					player.play();
				}
				setTimeout(() => {
					syncing = false;
				}, 500);
			});
		}

		return () => {
			player.dispose();
		};
	});

	// Set video source when URL changes
	$effect(() => {
		if (player && videoUrl) {
			player.src({ src: videoUrl, type: 'video/mp4' });
		}
	});

	// Player sync channel
	$effect(() => {
		const roomId = data.room.id;

		playerChannel = data.supabase.channel(`player:${roomId}`);

		if (!data.isOwner) {
			playerChannel.on(
				'broadcast',
				{ event: 'player_state' },
				(msg: { payload: { is_playing: boolean; time: number } }) => {
					if (player) {
						applyState(msg.payload.is_playing, msg.payload.time);
					}
				}
			);
		}

		playerChannel.subscribe();

		return () => {
			playerChannel?.unsubscribe();
		};
	});
</script>

<div class="size-full p-2">
	<div class="max-w-screen-xl mx-auto rounded-3xl size-full flex flex-col relative">
		<div class="p-4 flex flex-row items-center justify-center gap-2">
			<OfficeEpisodeSelect bind:selected={episode} onchange={onEpisodeChange} />
			<RoomAccess alias={data.room.alias} members={data.members} isOwner={data.isOwner} />
			<RoomPresence
				supabase={data.supabase}
				roomId={data.room.id}
				userEmail={data.user?.email ?? ''}
			/>
		</div>
		<div class="px-4 flex flex-1">
			<div class="bg-black flex flex-1 flex-col rounded-2xl overflow-hidden">
				<video bind:this={videoEl} class="video-js vjs-big-play-centered m-auto">
					<track kind="captions" />
				</video>
			</div>
		</div>
		<div>
			<Comments comments={data.comments} />
		</div>
	</div>
</div>
