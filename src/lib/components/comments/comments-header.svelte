<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { ArrowDownUp, ChevronsDownUp } from '@lucide/svelte';
	import { getCommentsContext } from './comments-context';

	let {class: className} = $props();

	const context = getCommentsContext();
</script>

<div class="flex items-center justify-between sticky top-0 z-10 bg-background py-2 {className}">
	<span class="uppercase text-xs text-muted-foreground font-medium">Comments</span>
	<div class="flex items-center gap-1">
		{#if context.expanded}
			<Button
				variant="outline"
				size="sm"
				onclick={() => {
					context.expanded = false;
				}}
			>
				<ChevronsDownUp />
				Collapse
			</Button>
		{/if}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button variant="outline" size="sm">
					<ArrowDownUp />
					{context.sort === 'newest' ? 'Newest' : 'Oldest'}
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item onclick={() => (context.sort = 'newest')}>Newest first</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => (context.sort = 'oldest')}>Oldest first</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
