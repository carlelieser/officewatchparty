<script lang="ts">
	import { page } from '$app/state';
	import OfficeEpisodeSelect from '$lib/features/episodes/components/office-episode-select.svelte';
	import Favorites from '$lib/features/favorites/components/favorites.svelte';
	import Rooms from '$lib/features/rooms/components/rooms.svelte';
	import ContinueWatching from '$lib/features/episodes/components/continue-watching.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import SectionHeader from '$lib/components/section-header.svelte';
	import type { Episode, ContinueWatchingItem } from '$lib/features/episodes/types';
	import { watchEpisode } from '$lib/features/episodes/start-room';

	let selected: Episode | null = $state(null);
	let continueWatching = $derived(
		(page.data.continueWatching as Array<ContinueWatchingItem>) ?? []
	);
</script>

<svelte:head>
	<title>Home - OWP</title>
</svelte:head>

<div class="mx-auto flex w-full max-w-screen-lg flex-col gap-8 p-4 md:p-6">
	<section class="flex flex-col gap-4">
		<PageHeader title="Hello, superfan." />
		<div class="w-full max-w-md">
			<OfficeEpisodeSelect bind:selected onchange={watchEpisode} class="w-full" />
		</div>
	</section>

	{#if continueWatching.length > 0}
		<section class="flex flex-col gap-3">
			<SectionHeader title="Continue Watching" />
			<ContinueWatching items={continueWatching} />
		</section>
	{/if}

	<section class="flex flex-col gap-3">
		<SectionHeader title="Favorites" seeAllHref="/favorites" />
		<Favorites initial={page.data.favorites} onselect={watchEpisode} showHeading={false} />
	</section>

	<section class="flex flex-col gap-3">
		<SectionHeader title="Your Rooms" seeAllHref="/rooms" />
		<Rooms initial={page.data.rooms} showHeading={false} />
	</section>
</div>
