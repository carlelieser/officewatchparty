<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	let scroller: HTMLDivElement | null = $state(null);
	let canScrollStart = $state(false);
	let canScrollEnd = $state(false);

	function scrollByStep(direction: 1 | -1): void {
		if (!scroller) return;
		scroller.scrollBy({ left: direction * scroller.clientWidth * 0.75, behavior: 'smooth' });
	}

	function updateScrollMask(): void {
		if (!scroller) return;
		const { scrollLeft, scrollWidth, clientWidth } = scroller;
		canScrollStart = scrollLeft > 1;
		canScrollEnd = scrollLeft + clientWidth < scrollWidth - 1;
	}

	// Measure once the row is in the DOM and whenever its size changes, since the
	// overflow state depends on the rendered width.
	$effect(() => {
		if (!scroller) return;
		updateScrollMask();
		const observer = new ResizeObserver(updateScrollMask);
		observer.observe(scroller);
		return () => observer.disconnect();
	});

	function switchSeason(value: string): void {
		const season = Number(value);
		if (!season || season === data.season) return;
		goto(`/seasons/${season}`);
	}
</script>

<div class="mx-auto flex w-full min-w-0 max-w-screen-lg flex-col gap-6 p-4 md:p-6">
	<div class="flex min-w-0 flex-col gap-4">
		<h1 class="page-header-title text-3xl font-bold font-display lg:text-4xl">
			Season {data.season}
		</h1>

		<div class="season-switcher relative w-full min-w-0">
			<div
				class="season-scroller -mx-1 min-w-0"
				class:mask-start={canScrollStart}
				class:mask-end={canScrollEnd}
			>
				<div
					bind:this={scroller}
					onscroll={updateScrollMask}
					class="w-full min-w-0 max-w-full overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					<ToggleGroup.Root
						type="single"
						variant="outline"
						spacing={2}
						value={String(data.season)}
						onValueChange={switchSeason}
					>
						{#each data.seasonNumbers as season (season)}
							<ToggleGroup.Item
								value={String(season)}
								aria-label={`Season ${season}`}
								class="shrink-0"
							>
								Season {season}
							</ToggleGroup.Item>
						{/each}
					</ToggleGroup.Root>
				</div>
			</div>

			{#if canScrollStart}
				<Button
					variant="outline"
					size="icon-sm"
					aria-label="Scroll seasons left"
					onclick={() => scrollByStep(-1)}
					class="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-background shadow-sm dark:bg-background"
				>
					<ChevronLeft class="size-4" />
				</Button>
			{/if}

			{#if canScrollEnd}
				<Button
					variant="outline"
					size="icon-sm"
					aria-label="Scroll seasons right"
					onclick={() => scrollByStep(1)}
					class="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-background shadow-sm dark:bg-background"
				>
					<ChevronRight class="size-4" />
				</Button>
			{/if}
		</div>
	</div>

	{@render children()}
</div>

<style>
	/* The season switcher persists across season changes; give the whole row its
	   own view-transition group so it holds in place instead of sliding with the
	   content. */
	.season-switcher {
		view-transition-name: season-switcher;
	}

	/* Fade the row's leading/trailing edge only when there is more to scroll in
	   that direction. The fade width is applied by toggling mask-start/mask-end. */
	.season-scroller {
		--fade: 1.5rem;
		--mask-start: 0px;
		--mask-end: 0px;
		mask-image: linear-gradient(
			to right,
			transparent 0,
			black var(--mask-start),
			black calc(100% - var(--mask-end)),
			transparent 100%
		);
	}

	.season-scroller.mask-start {
		--mask-start: var(--fade);
	}

	.season-scroller.mask-end {
		--mask-end: var(--fade);
	}
</style>
