<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { ChevronRight } from '@lucide/svelte';

	type SectionHeaderProps = {
		title: string;
		seeAllHref?: string;
		action?: Snippet;
	};

	let { title, seeAllHref, action }: SectionHeaderProps = $props();
</script>

<div class="group/section-header flex items-center justify-between gap-2">
	<span class="text-xs font-medium uppercase text-muted-foreground">{title}</span>
	<div class="flex items-center">
		{@render action?.()}
		{#if seeAllHref}
			<Button variant="link" size="icon" href={seeAllHref} aria-label={`See all ${title}`}>
				<ChevronRight />
			</Button>
		{/if}
	</div>
</div>
