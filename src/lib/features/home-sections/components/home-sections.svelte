<script lang="ts" module>
	type VisibilityMessages = {
		saved: (title: string) => string;
		failed: (title: string) => string;
	};

	const hideMessages: VisibilityMessages = {
		saved: (title) => `${title} hidden`,
		failed: (title) => `Couldn't hide ${title}. Check your connection and try again.`
	};

	const showMessages: VisibilityMessages = {
		saved: (title) => `${title} is back on your home page`,
		failed: (title) => `Couldn't show ${title}. Check your connection and try again.`
	};
</script>

<script lang="ts">
	import { toast } from 'svelte-sonner';
	import HomeSectionView from './home-section.svelte';
	import HiddenSections from './hidden-sections.svelte';
	import { saveSectionVisibility } from '../api';
	import { SectionVisibility } from '../section-visibility.svelte';
	import type { HomeSectionKey } from '../home-section-keys';
	import type { HomeSection, SaveSectionVisibility } from '../types';

	type HomeSectionsProps = {
		sections: Array<HomeSection>;
		initialHidden: Array<HomeSectionKey>;
		save?: SaveSectionVisibility;
	};

	let { sections, initialHidden, save = saveSectionVisibility }: HomeSectionsProps = $props();

	// Visibility is owned here after the first render; the server copy only seeds it.
	// svelte-ignore state_referenced_locally
	const visibility = new SectionVisibility(initialHidden, save);

	let availableSections = $derived(sections.filter((section) => section.isAvailable));
	let shownSections = $derived(
		availableSections.filter((section) => !visibility.isHidden(section.key))
	);
	let hiddenSections = $derived(
		availableSections.filter((section) => visibility.isHidden(section.key))
	);

	async function toggleSection(section: HomeSection): Promise<void> {
		const isHiding = !visibility.isHidden(section.key);
		const messages = isHiding ? hideMessages : showMessages;

		const outcome = await visibility.setHidden(section.key, isHiding);
		if (outcome.kind === 'saved') toast.success(messages.saved(section.title));
		else toast.error(messages.failed(section.title));
	}
</script>

{#snippet homeSection(section: HomeSection)}
	<HomeSectionView
		{section}
		isHidden={visibility.isHidden(section.key)}
		isPending={visibility.isPending(section.key)}
		ontoggle={toggleSection}
	/>
{/snippet}

{#each shownSections as section (section.key)}
	{@render homeSection(section)}
{/each}

{#if hiddenSections.length > 0}
	<HiddenSections count={hiddenSections.length}>
		{#each hiddenSections as section (section.key)}
			{@render homeSection(section)}
		{/each}
	</HiddenSections>
{/if}
