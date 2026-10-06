<script lang="ts">
	import { resolve } from '$app/paths';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { episodeGuidePath } from '$lib/features/guide';
	import { episodeThumbnailUrl, formatSeasonEpisode } from '$lib/shared/format';
	import type { Episode } from '$lib/features/episodes/types';

	interface FeaturedEpisodeCardProps {
		episode: Episode;
	}

	let { episode }: FeaturedEpisodeCardProps = $props();

	let thumbnailUrl = $derived(episodeThumbnailUrl(episode.season, episode.episode));
	let metadata = $derived(formatSeasonEpisode(episode.season, episode.episode));
</script>

<li>
	<a
		href={resolve(episodeGuidePath(episode))}
		class="group relative block aspect-[2/1] overflow-hidden rounded-xl border bg-muted outline-none transition-colors hover:border-muted-foreground/40 focus-visible:ring-[3px] focus-visible:ring-ring/50"
	>
		<Skeleton class="absolute inset-0 size-full rounded-none" />
		<img
			src={thumbnailUrl}
			alt=""
			width="640"
			height="320"
			loading="lazy"
			decoding="async"
			class="relative size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
		<div class="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3">
			<span class="line-clamp-1 text-sm font-medium text-white">{episode.label}</span>
			<span class="text-xs text-white/70">{metadata}</span>
		</div>
	</a>
</li>
