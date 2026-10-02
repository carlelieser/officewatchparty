<script lang="ts">
	import * as Item from '$lib/components/ui/item';
	import EpisodeListItem from '$lib/features/episodes/components/episode-list-item.svelte';
	import { watchEpisode } from '$lib/features/episodes/start-room';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Season {data.season} - OWP</title>
</svelte:head>

<Item.Group class="-mx-4">
	{#each data.episodes as episode (episode.episode)}
		<EpisodeListItem {episode} variant="default" onselect={watchEpisode} />
	{/each}
</Item.Group>
