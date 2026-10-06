<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { episodeThumbnailUrl } from '$lib/shared/format';
	import type { Episode } from '$lib/features/episodes/types';

	interface MockupVideoFrameProps {
		episode: Episode;
		overlay?: Snippet;
	}

	let { episode, overlay }: MockupVideoFrameProps = $props();

	let thumbnailUrl = $derived(episodeThumbnailUrl(episode.season, episode.episode));
</script>

<div class="relative aspect-[2/1] overflow-hidden rounded-xl bg-muted">
	<Skeleton class="absolute inset-0 size-full rounded-none" />
	<img
		src={thumbnailUrl}
		alt=""
		width="640"
		height="320"
		fetchpriority="high"
		decoding="async"
		class="relative size-full object-cover"
	/>
	<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
	{@render overlay?.()}
</div>
