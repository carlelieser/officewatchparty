<script lang="ts">
	import CardCarousel from '$lib/components/card-carousel.svelte';
	import EpisodeCard from '$lib/features/episodes/components/episode-card.svelte';
	import EpisodeMenu from '$lib/features/episodes/components/episode-menu.svelte';
	import { goto } from '$app/navigation';
	import type { ContinueWatchingItem } from '$lib/features/episodes/types';

	interface ContinueWatchingProps {
		items: Array<ContinueWatchingItem>;
	}

	let { items }: ContinueWatchingProps = $props();

	function itemKey(item: ContinueWatchingItem): string {
		return `${item.episode.season}-${item.episode.episode}`;
	}

	function resume(item: ContinueWatchingItem): void {
		const resumeTime = Math.floor(item.progressSeconds);
		goto(`/watch?season=${item.episode.season}&episode=${item.episode.episode}&t=${resumeTime}`);
	}
</script>

<CardCarousel {items} key={itemKey}>
	{#snippet card(item: ContinueWatchingItem)}
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
	{/snippet}
</CardCarousel>
