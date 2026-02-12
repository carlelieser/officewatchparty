<script lang="ts">
	import type { Episode } from '$lib/features/episodes/types';
	import * as Popover from '$lib/components/ui/popover';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Button } from '$lib/components/ui/button';
	import { Check, ChevronRight, ChevronsUpDown, TvIcon } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import { padNumber } from '$lib/shared/format';

	interface EpisodeSelectProps {
		episodes: Array<Episode>;
		selected: Episode | null;
		onchange?: (episode: Episode) => void;
		disabled?: boolean;
		class?: string;
	}

	let {
		episodes,
		selected = $bindable<Episode | null>(null),
		onchange,
		disabled = false,
		class: className
	}: EpisodeSelectProps = $props();

	let open = $state(false);

	function isSelected(entry: Episode): boolean {
		return selected?.season === entry.season && selected?.episode === entry.episode;
	}

	function handleSelect(entry: Episode): void {
		selected = entry;
		open = false;
		onchange?.(entry);
	}

	const grouped = $derived(Map.groupBy(episodes, (entry) => entry.season));
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				{disabled}
				class={cn('max-w-md min-w-0 flex flex-row overflow-hidden', className)}
			>
				<TvIcon />
				<span class="truncate min-w-0">
					{selected ? `${selected.label} — ${selected.description}` : 'Select episode...'}
				</span>
				<ChevronsUpDown class="ml-auto opacity-50 shrink-0" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-full max-w-sm md:max-w-124 p-0 min-w-(--bits-popover-anchor-width)" align="start">
		<div class="max-h-72 overflow-y-auto p-1">
			{#each grouped as [season, seasonEpisodes]}
				<Collapsible.Root open={selected?.season === season}>
					<Collapsible.Trigger
						class="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent [&[data-state=open]>svg:first-child]:rotate-90"
					>
						<ChevronRight class="size-4 shrink-0 transition-transform" />
						<span>Season {season}</span>
						<span class="ml-auto text-xs text-muted-foreground">{seasonEpisodes.length} episodes</span>
					</Collapsible.Trigger>
					<Collapsible.Content>
						<div class="ml-2 border-l pl-1">
							{#each seasonEpisodes as entry (entry.episode)}
								<button
									class="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
									onclick={() => handleSelect(entry)}
								>
									<div class="flex size-6 shrink-0 items-center justify-center rounded-full font-mono">
										{#if isSelected(entry)}
											<Check class="size-4" />
										{:else}
											<span class="text-xs font-bold text-muted-foreground">{padNumber(entry.episode)}</span>
										{/if}
									</div>
									<div class="flex min-w-0 flex-col">
										<span class="font-medium">{entry.label}</span>
										<span class="truncate text-muted-foreground">{entry.description}</span>
									</div>
								</button>
							{/each}
						</div>
					</Collapsible.Content>
				</Collapsible.Root>
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>
