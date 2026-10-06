<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ChevronDown } from '@lucide/svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Button } from '$lib/components/ui/button';
	import SectionHeader from '$lib/components/section-header.svelte';
	import { cn } from '$lib/utils.js';

	type HiddenSectionsProps = {
		count: number;
		children: Snippet;
	};

	let { count, children }: HiddenSectionsProps = $props();

	let isOpen = $state(false);
</script>

<Collapsible.Root bind:open={isOpen}>
	<section class="flex flex-col gap-3 border-t pt-6">
		<SectionHeader title={`Hidden (${count})`}>
			{#snippet action()}
				<Collapsible.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							variant="ghost"
							size="icon-sm"
							aria-label={isOpen ? 'Collapse hidden sections' : 'Expand hidden sections'}
						>
							<ChevronDown class={cn('transition-transform', isOpen && 'rotate-180')} />
						</Button>
					{/snippet}
				</Collapsible.Trigger>
			{/snippet}
		</SectionHeader>
		<Collapsible.Content
			class="flex flex-col gap-8 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down motion-reduce:animate-none"
		>
			{@render children()}
		</Collapsible.Content>
	</section>
</Collapsible.Root>
