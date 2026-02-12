<script lang="ts">
	import type { Episode } from '$lib/features/episodes/types';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { Button } from '$lib/components/ui/button';
	import { Check, ChevronsUpDown, TvIcon } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import { formatEpisodeCode, padNumber } from '$lib/shared/format';

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
	<Popover.Content class="w-full max-w-sm md:max-w-124 p-0 min-w-0" align="start">
		<Command.Root>
			<Command.Input placeholder="Search episodes..." />
			<Command.List>
				<Command.Empty>No episodes found.</Command.Empty>
				{#each grouped as [season, seasonEpisodes]}
					<Command.Group heading="Season {season}">
						{#each seasonEpisodes as entry}
							<Command.Item
								value="{formatEpisodeCode(season, entry.episode)} {entry.label}"
								onSelect={() => {
									selected = entry;
									open = false;
									onchange?.(entry);
								}}
							>
								<div class="p-2 rounded-full flex items-center justify-center font-mono">
									{#if isSelected(entry)}
										<Check />
									{:else}
										<span class="text-xs font-bold uppercase text-muted-foreground"
											>{padNumber(entry.episode)}</span
										>
									{/if}
								</div>
								<div class="flex flex-col gap-0 min-w-0">
									<span class="font-medium">{entry.label}</span>
									<span class="truncate text-muted-foreground">{entry.description}</span>
								</div>
							</Command.Item>
						{/each}
					</Command.Group>
				{/each}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
