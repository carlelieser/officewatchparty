<script lang="ts">
	import { page } from '$app/state';
	import OfficeEpisodeSelect from '$lib/features/episodes/components/office-episode-select.svelte';
	import Favorites from '$lib/features/favorites/components/favorites.svelte';
	import Rooms from '$lib/features/rooms/components/rooms.svelte';
	import ContinueWatching from '$lib/features/episodes/components/continue-watching.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import type { Episode, ContinueWatchingItem } from '$lib/features/episodes/types';
	import { watchEpisode } from '$lib/features/episodes/start-room';
	import { TriviaCard, type DailyTrivia } from '$lib/features/trivia';
	import { HomeSections, type HomeSection, type HomeSectionKey } from '$lib/features/home-sections';

	let selected: Episode | null = $state(null);
	let continueWatching = $derived(
		(page.data.continueWatching as Array<ContinueWatchingItem>) ?? []
	);
	let dailyTrivia = $derived((page.data.dailyTrivia as DailyTrivia | null) ?? null);
	let hiddenSections = $derived(page.data.hiddenSections as Array<HomeSectionKey>);

	let sections: Array<HomeSection> = $derived([
		{
			key: 'daily-trivia',
			title: 'Daily Trivia',
			seeAllHref: '/trivia',
			isAvailable: dailyTrivia !== null,
			content: dailyTriviaContent
		},
		{
			key: 'continue-watching',
			title: 'Continue Watching',
			isAvailable: continueWatching.length > 0,
			content: continueWatchingContent
		},
		{
			key: 'favorites',
			title: 'Favorites',
			seeAllHref: '/favorites',
			isAvailable: true,
			content: favoritesContent
		},
		{
			key: 'rooms',
			title: 'Your Rooms',
			seeAllHref: '/rooms',
			isAvailable: true,
			content: roomsContent
		}
	]);
</script>

<svelte:head>
	<title>Home - OWP</title>
</svelte:head>

{#snippet dailyTriviaContent()}
	{#if dailyTrivia}
		<div class="w-full max-w-md">
			<TriviaCard trivia={dailyTrivia} today={page.data.today} />
		</div>
	{/if}
{/snippet}

{#snippet continueWatchingContent()}
	<ContinueWatching items={continueWatching} />
{/snippet}

{#snippet favoritesContent()}
	<Favorites initial={page.data.favorites} onselect={watchEpisode} showHeading={false} />
{/snippet}

{#snippet roomsContent()}
	<Rooms initial={page.data.rooms} showHeading={false} />
{/snippet}

<div class="mx-auto flex w-full max-w-screen-lg flex-col gap-8 p-4 md:p-6">
	<section class="flex flex-col gap-4">
		<PageHeader title="Hello, superfan." />
		<div class="w-full max-w-md">
			<OfficeEpisodeSelect bind:selected onchange={watchEpisode} class="w-full" />
		</div>
	</section>

	<HomeSections {sections} initialHidden={hiddenSections} />
</div>
