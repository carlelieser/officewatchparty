<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import EpisodeCard from '$lib/features/episodes/components/episode-card.svelte';
	import EpisodeMenu from '$lib/features/episodes/components/episode-menu.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { ContinueWatchingItem } from '$lib/features/episodes/types';

	interface ContinueWatchingProps {
		items: Array<ContinueWatchingItem>;
	}

	let { items }: ContinueWatchingProps = $props();

	function resume(item: ContinueWatchingItem): void {
		const resumeTime = Math.floor(item.progressSeconds);
		const watchPath = resolve('/watch');
		const resumeUrl = `${watchPath}?season=${item.episode.season}&episode=${item.episode.episode}&t=${resumeTime}`;
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- resolve() does not accept query strings; the path is resolved
		goto(resumeUrl);
	}
</script>

<Carousel.Root opts={{ align: 'start', dragFree: true }} class="w-full">
	<Carousel.Content class="-ml-3">
		{#each items as item (`${item.episode.season}-${item.episode.episode}`)}
			<Carousel.Item class="basis-2/3 pl-3 sm:basis-1/2 lg:basis-1/3">
				<EpisodeCard
					season={item.episode.season}
					episode={item.episode.episode}
					label={item.episode.label}
					progress={item.durationSeconds > 0 ? item.progressSeconds / item.durationSeconds : 0}
					onclick={() => resume(item)}
				>
					{#snippet menu()}
						<EpisodeMenu episode={item.episode} onDark />
					{/snippet}
				</EpisodeCard>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous class="start-1 hidden bg-background dark:bg-background sm:flex" />
	<Carousel.Next class="end-1 hidden bg-background dark:bg-background sm:flex" />
</Carousel.Root>
