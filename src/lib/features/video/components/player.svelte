<script lang="ts" module>
	export type PlayerHandle = {
		getCurrentTime: () => number;
		isPaused: () => boolean;
		seek: (time: number) => void;
		play: () => void;
		pause: () => void;
	};
</script>

<script lang="ts">
	import type { Episode } from '$lib/features/episodes/types';
	import { formatEpisodeCode } from '$lib/shared/format';
	import videojs from 'video.js';
	import type VideoJsPlayer from 'video.js/dist/types/player';

	type ThemeConfig = {
		skin?: 'slate' | 'spaced' | 'sleek' | 'zen';
		color?: string;
	};

	type ThemedPlayer = VideoJsPlayer & {
		theme?: (options: ThemeConfig) => void;
	};

	import 'video.js/dist/video-js.css';
	import 'videojs-theme-kit/videojs-skin.min.js';
	import 'videojs-theme-kit/style.css';
	import chromecastPlugin from '@silvermine/videojs-chromecast';
	import '@silvermine/videojs-chromecast/dist/silvermine-videojs-chromecast.css';
	import airPlayPlugin from '@silvermine/videojs-airplay';
	import '@silvermine/videojs-airplay/dist/silvermine-videojs-airplay.css';

	chromecastPlugin(videojs);
	airPlayPlugin(videojs);

	interface PlayerProps {
		videoUrl: string;
		autoplay: boolean;
		episode: Episode | null;
		controls?: boolean;
		// Seconds to resume playback from on initial load (0 = from the start).
		startTime?: number;
		// Raw media events, used by wrappers (e.g. room sync) to observe playback.
		onplay?: () => void;
		onpause?: () => void;
		onseeked?: () => void;
		ontimeupdate?: (currentTime: number, duration: number) => void;
		onended?: () => void;
		onloadedmetadata?: () => void;
		// Imperative handle for wrappers to drive playback (e.g. apply synced state).
		handle?: PlayerHandle;
	}

	let {
		videoUrl,
		autoplay,
		episode,
		controls = true,
		startTime = 0,
		onplay,
		onpause,
		onseeked,
		ontimeupdate,
		onended,
		onloadedmetadata,
		handle = $bindable()
	}: PlayerProps = $props();

	let videoElement: HTMLVideoElement;
	let player: ThemedPlayer;

	function updateMediaSession(current: Episode): void {
		if (!('mediaSession' in navigator)) return;

		const episodeCode = formatEpisodeCode(current.season, current.episode);

		navigator.mediaSession.metadata = new MediaMetadata({
			title: `${episodeCode} — ${current.label}`,
			artist: 'The Office',
			album: `Season ${current.season}`
		});
	}

	function clearMediaSession(): void {
		if (!('mediaSession' in navigator)) return;
		navigator.mediaSession.metadata = null;
	}

	function getChromecastTitle(): string {
		if (!episode) return 'The Office';
		return `${formatEpisodeCode(episode.season, episode.episode)} — ${episode.label}`;
	}

	function getChromecastSubtitle(): string {
		if (!episode) return '';
		return episode.description;
	}

	function loadCastSdk(): void {
		if (document.querySelector('script[src*="cast_sender"]')) return;
		const script = document.createElement('script');
		script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
		document.head.appendChild(script);
	}

	// Initialize player
	$effect(() => {
		loadCastSdk();

		player = videojs(videoElement, {
			controls,
			fill: true,
			preload: 'auto',
			techOrder: ['chromecast', 'html5'],
			chromecast: {
				requestTitleFn: getChromecastTitle,
				requestSubtitleFn: getChromecastSubtitle
			},
			plugins: {
				chromecast: {},
				airPlay: {}
			}
		});

		player.on('ready', () => {
			player.theme?.({ skin: 'spaced' });
		});

		player.on('play', () => onplay?.());
		player.on('pause', () => onpause?.());
		player.on('seeked', () => onseeked?.());
		player.on('ended', () => onended?.());
		player.on('loadedmetadata', () => onloadedmetadata?.());
		player.on('timeupdate', () => {
			ontimeupdate?.(player.currentTime() ?? 0, player.duration() ?? 0);
		});

		handle = {
			getCurrentTime: () => player.currentTime() ?? 0,
			isPaused: () => player.paused() ?? true,
			seek: (time: number) => player.currentTime(time),
			play: () => {
				player.play();
			},
			pause: () => player.pause()
		};

		return () => {
			player.dispose();
		};
	});

	// Set video source when URL changes
	$effect(() => {
		if (player && videoUrl) {
			player.src({ src: videoUrl, type: 'video/mp4' });
			player.theme?.({ skin: 'spaced' });
			if (startTime > 0) {
				player.one('loadedmetadata', () => {
					player.currentTime(startTime);
				});
			}
			if (autoplay) {
				player.ready(() => {
					player.play();
				});
			}
		}
	});

	// Update device now-playing metadata
	$effect(() => {
		if (!episode) return;
		updateMediaSession(episode);
		return clearMediaSession;
	});
</script>

<video bind:this={videoElement} class="video-js vjs-big-play-centered m-auto">
	<track kind="captions" />
</video>
