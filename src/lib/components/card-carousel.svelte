<script lang="ts" generics="Item">
	import * as Carousel from '$lib/components/ui/carousel';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import type { Snippet } from 'svelte';

	interface CardCarouselProps {
		items: Array<Item>;
		key: (item: Item) => string;
		card: Snippet<[Item]>;
	}

	let { items, key, card }: CardCarouselProps = $props();

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
		{#each items as item (key(item))}
			<Carousel.Item class="basis-2/3 pl-3 sm:basis-1/2 lg:basis-1/3">
				{@render card(item)}
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	{#if canScrollPrev}
		<Carousel.Previous class="start-1 hidden bg-background dark:bg-background sm:flex" />
	{/if}
	{#if canScrollNext}
		<Carousel.Next class="end-1 hidden bg-background dark:bg-background sm:flex" />
	{/if}
</Carousel.Root>
