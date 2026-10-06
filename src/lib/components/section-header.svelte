<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronRight } from '@lucide/svelte';

	type SectionHeaderProps = {
		title: string;
		seeAllHref?: string;
	};

	let { title, seeAllHref }: SectionHeaderProps = $props();
</script>

<div class="flex items-center justify-between">
	<span class="text-xs font-medium uppercase text-muted-foreground">{title}</span>
	{#if seeAllHref}
		<Button variant="link" size="sm" href={seeAllHref} class="!px-0">
			See all
			<ChevronRight class="size-4" />
		</Button>
	{/if}
</div>
