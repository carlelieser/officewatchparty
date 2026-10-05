<script lang="ts">
	import CardCarousel from '$lib/components/card-carousel.svelte';
	import EpisodeCard from '$lib/features/episodes/components/episode-card.svelte';
	import EpisodeMenu from '$lib/features/episodes/components/episode-menu.svelte';
	import type { Episode } from '$lib/features/episodes/types';

	interface EpisodeCarouselProps {
		episodes: Array<Episode>;
		onselect?: (episode: Episode) => void;
	}

	let { episodes, onselect }: EpisodeCarouselProps = $props();

	function episodeKey(episode: Episode): string {
		return `${episode.season}-${episode.episode}`;
	}
</script>

<CardCarousel items={episodes} key={episodeKey}>
	{#snippet card(episode: Episode)}
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
	{/snippet}
</CardCarousel>
