<script lang="ts">
	import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
	import type { Room } from '$lib/features/rooms/types';
	import videojs from 'video.js';
	import type Player from 'video.js/dist/types/player';
	import 'video.js/dist/video-js.css';
	import 'videojs-theme-kit/videojs-skin.min.js';
	import 'videojs-theme-kit/style.css';
	import chromecastPlugin from '@silvermine/videojs-chromecast';
	import '@silvermine/videojs-chromecast/dist/silvermine-videojs-chromecast.css';
	import airPlayPlugin from '@silvermine/videojs-airplay';
	import '@silvermine/videojs-airplay/dist/silvermine-videojs-airplay.css';
	import { updatePlayerState } from '$lib/features/rooms/api';

	chromecastPlugin(videojs);
	airPlayPlugin(videojs);

	interface VideoPlayerProps {
		supabase: SupabaseClient;
		room: Room;
		isOwner: boolean;
		videoUrl: string;
	}

	let { supabase, room, isOwner, videoUrl }: VideoPlayerProps = $props();

	let videoElement: HTMLVideoElement;
	let player: Player;
	let syncing = false;
	let playerChannel: RealtimeChannel | undefined;

	function loadCastSdk(): void {
		if (document.querySelector('script[src*="cast_sender"]')) return;
		const script = document.createElement('script');
		script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
		document.head.appendChild(script);
	}

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

	function handleOwnerPlay(): void {
		if (syncing) return;
		const time = player.currentTime() ?? 0;
		broadcastState(true, time);
		persistState(true, time);
	}

	function handleOwnerPause(): void {
		if (syncing) return;
		const time = player.currentTime() ?? 0;
		broadcastState(false, time);
		persistState(false, time);
	}

	function handleOwnerSeeked(): void {
		if (syncing) return;
		const time = player.currentTime() ?? 0;
		const isPlaying = !player.paused();
		broadcastState(isPlaying, time);
		persistState(isPlaying, time);
	}

	function applyState(isPlaying: boolean, time: number): void {
		syncing = true;
		player.currentTime(time);
		if (isPlaying) {
			player.play();
		} else {
			player.pause();
		}
		setTimeout(() => {
			syncing = false;
		}, 500);
	}

	// Initialize player
	$effect(() => {
		loadCastSdk();

		player = videojs(videoElement, {
			controls: isOwner,
			fill: true,
			preload: 'auto',
			techOrder: ['chromecast', 'html5'],
			plugins: {
				chromecast: {},
				airPlay: {}
			}
		});

		player.on('ready', () => {
			(player as any).theme({ skin: 'spaced' });
		});

		if (isOwner) {
			player.on('play', handleOwnerPlay);
			player.on('pause', handleOwnerPause);
			player.on('seeked', handleOwnerSeeked);
		}

		// Apply initial player state for non-owners
		if (!isOwner && room) {
			player.one('loadedmetadata', () => {
				let time = room.player_time ?? 0;
				if (room.is_playing && room.player_updated_at) {
					const updatedAtTimestamp = new Date(room.player_updated_at).getTime();
					const elapsedMilliseconds = Date.now() - updatedAtTimestamp;
					const elapsedSeconds = elapsedMilliseconds / 1000;
					time += elapsedSeconds;
				}
				syncing = true;
				player.currentTime(time);
				if (room.is_playing) {
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
		playerChannel = supabase.channel(`player:${room.id}`);

		if (!isOwner) {
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

<video bind:this={videoElement} class="video-js vjs-big-play-centered m-auto">
	<track kind="captions" />
</video>
