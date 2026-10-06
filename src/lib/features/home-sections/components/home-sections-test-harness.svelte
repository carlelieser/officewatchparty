<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import HomeSections from './home-sections.svelte';
	import type { HomeSectionKey } from '../home-section-keys';
	import type { HomeSection, SaveSectionVisibility } from '../types';

	type HomeSectionsTestHarnessProps = {
		initialHidden: Array<HomeSectionKey>;
		save: SaveSectionVisibility;
	};

	let { initialHidden, save }: HomeSectionsTestHarnessProps = $props();

	const sections: Array<HomeSection> = [
		{ key: 'continue-watching', title: 'Continue Watching', isAvailable: false, content: empty },
		{
			key: 'favorites',
			title: 'Favorites',
			seeAllHref: '/favorites',
			isAvailable: true,
			content: favorites
		},
		{ key: 'rooms', title: 'Your Rooms', isAvailable: true, content: rooms }
	];
</script>

{#snippet empty()}{/snippet}

{#snippet favorites()}
	<p>Favorite episodes</p>
{/snippet}

{#snippet rooms()}
	<p>Watch party rooms</p>
{/snippet}

<Toaster />
<HomeSections {sections} {initialHidden} {save} />
