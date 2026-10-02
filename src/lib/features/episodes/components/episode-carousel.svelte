<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import EpisodeCard from '$lib/features/episodes/components/episode-card.svelte';
	import EpisodeMenu from '$lib/features/episodes/components/episode-menu.svelte';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import type { Episode } from '$lib/features/episodes/types';

	interface EpisodeCarouselProps {
		episodes: Array<Episode>;
		onselect?: (episode: Episode) => void;
	}

	let { episodes, onselect }: EpisodeCarouselProps = $props();

	let canScrollPrev = $state(false);
	let canScrollNext = $state(false);

	function syncScrollState(api: CarouselAPI | undefined): void {
		if (!api) return;
		canScrollPrev = api.canScrollPrev();
		canScrollNext = api.canScrollNext();
	}

	function registerApi(api: CarouselAPI | undefined): void {
		if (!api) return;
		syncScrollState(api);
		api.on('select', syncScrollState);
		api.on('reInit', syncScrollState);
	}
</script>

<Carousel.Root opts={{ align: 'start', dragFree: true }} setApi={registerApi} class="w-full">
	<Carousel.Content class="-ml-3">
		{#each episodes as episode (`${episode.season}-${episode.episode}`)}
			<Carousel.Item class="basis-2/3 pl-3 sm:basis-1/2 lg:basis-1/3">
				<EpisodeCard
					season={episode.season}
					episode={episode.episode}
					label={episode.label}
					onclick={() => onselect?.(episode)}
				>
					{#snippet menu()}
						<EpisodeMenu {episode} onDark />
					{/snippet}
				</EpisodeCard>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	{#if canScrollPrev}
		<Carousel.Previous class="start-1 hidden sm:flex" />
	{/if}
	{#if canScrollNext}
		<Carousel.Next class="end-1 hidden sm:flex" />
	{/if}
</Carousel.Root>
