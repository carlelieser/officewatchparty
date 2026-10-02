<script lang="ts">
	import EpisodeCard from '$lib/features/episodes/components/episode-card.svelte';
	import type { Episode } from '$lib/features/episodes/types';

	interface EpisodeGridProps {
		episodes: Array<Episode>;
		onselect?: (episode: Episode) => void;
	}

	let { episodes, onselect }: EpisodeGridProps = $props();
</script>

<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
	{#each episodes as episode (`${episode.season}-${episode.episode}`)}
		<EpisodeCard
			season={episode.season}
			episode={episode.episode}
			label={episode.label}
			onclick={() => onselect?.(episode)}
		/>
	{/each}
</div>
