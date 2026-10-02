<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import EpisodeCarousel from '$lib/features/episodes/components/episode-carousel.svelte';
	import { watchEpisode } from '$lib/features/episodes/start-room';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Episodes - OWP</title>
</svelte:head>

<div class="mx-auto flex w-full min-w-0 max-w-screen-lg flex-col gap-8 p-4 md:p-6">
	<PageHeader title="Episodes" description="Every episode across all nine seasons." />

	{#each data.seasons as season (season.season)}
		<section class="flex min-w-0 flex-col gap-3">
			<h2 class="text-xs font-medium uppercase text-muted-foreground">Season {season.season}</h2>
			<EpisodeCarousel episodes={season.episodes} onselect={watchEpisode} />
		</section>
	{/each}
</div>
