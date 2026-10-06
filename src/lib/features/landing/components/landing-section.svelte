<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	interface LandingSectionProps {
		id: string;
		heading: string;
		eyebrow?: string;
		description?: string;
		isMuted?: boolean;
		isCentered?: boolean;
		class?: string;
		children: Snippet;
	}

	let {
		id,
		heading,
		eyebrow,
		description,
		isMuted = false,
		isCentered = false,
		class: className,
		children
	}: LandingSectionProps = $props();

	let headingId = $derived(`${id}-heading`);
</script>

<section
	{id}
	aria-labelledby={headingId}
	class={cn('w-full py-20 sm:py-28', isMuted && 'bg-muted/40', className)}
>
	<div class="mx-auto flex w-full max-w-screen-lg flex-col gap-12 px-6">
		<div class={cn('flex flex-col gap-3', isCentered && 'items-center text-center')}>
			{#if eyebrow}
				<span class="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
					{eyebrow}
				</span>
			{/if}
			<h2 id={headingId} class="font-display text-3xl font-bold tracking-tight sm:text-4xl">
				{heading}
			</h2>
			{#if description}
				<p class="max-w-2xl text-base text-muted-foreground text-pretty sm:text-lg">
					{description}
				</p>
			{/if}
		</div>
		{@render children()}
	</div>
</section>
