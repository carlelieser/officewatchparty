<script lang="ts">
	import SectionHeader from '$lib/components/section-header.svelte';
	import SectionVisibilityToggle from './section-visibility-toggle.svelte';
	import type { HomeSection } from '../types';

	type HomeSectionProps = {
		section: HomeSection;
		isHidden: boolean;
		isPending: boolean;
		ontoggle: (section: HomeSection) => void;
	};

	let { section, isHidden, isPending, ontoggle }: HomeSectionProps = $props();

	function handleToggle(): void {
		ontoggle(section);
	}
</script>

<section class="flex flex-col gap-3">
	<SectionHeader title={section.title} seeAllHref={section.seeAllHref}>
		{#snippet action()}
			<SectionVisibilityToggle
				title={section.title}
				{isHidden}
				{isPending}
				onclick={handleToggle}
			/>
		{/snippet}
	</SectionHeader>
	{@render section.content()}
</section>
