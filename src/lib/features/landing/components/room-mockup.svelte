<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import MockupPlaybackBar from './mockup-playback-bar.svelte';
	import MockupReactionChips from './mockup-reaction-chips.svelte';
	import MockupVideoFrame from './mockup-video-frame.svelte';
	import MockupViewerAvatars from './mockup-viewer-avatars.svelte';
	import type { Episode } from '$lib/features/episodes/types';

	interface RoomMockupProps {
		episode: Episode;
	}

	let { episode }: RoomMockupProps = $props();
</script>

<div
	aria-hidden="true"
	class="relative mx-auto w-full max-w-4xl rounded-2xl border bg-card p-2 text-left shadow-xl ring-1 ring-foreground/5 sm:p-3"
>
	<div class="flex items-center justify-between gap-3 px-1 pb-2 sm:pb-3">
		<div class="flex min-w-0 flex-col">
			<span class="truncate text-sm font-medium">{m.landing_mockup_room_name()}</span>
			<span class="truncate text-xs text-muted-foreground">{episode.label}</span>
		</div>
		<MockupViewerAvatars />
	</div>
	<MockupVideoFrame {episode}>
		{#snippet overlay()}
			<MockupReactionChips />
		{/snippet}
	</MockupVideoFrame>
	<MockupPlaybackBar />
</div>
