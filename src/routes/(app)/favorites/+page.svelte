<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import Favorites from '$lib/features/favorites/components/favorites.svelte';
	import { watchEpisode } from '$lib/features/episodes/start-room';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Favorites - OWP</title>
</svelte:head>

<div class="mx-auto flex w-full max-w-screen-lg flex-col gap-6 p-4 md:p-6">
	<PageHeader title="Favorites" description="Episodes you've saved to watch again." />
	<Favorites initial={data.favorites} onselect={watchEpisode} showHeading={false} />
</div>
