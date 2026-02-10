<script lang="ts" module>
	export type Episode = {
		season: number;
		episode: number;
		label: string;
		description: string;
	};
</script>

<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { Button } from '$lib/components/ui/button';
	import { Check, ChevronsUpDown } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	let {
		episodes,
		selected = $bindable<Episode | null>(null),
		onchange
	}: {
		episodes: Episode[];
		selected: Episode | null;
		onchange?: (episode: Episode) => void;
	} = $props();

	let open = $state(false);

	function isSelected(ep: Episode) {
		return selected?.season === ep.season && selected?.episode === ep.episode;
	}

	const grouped = $derived(Map.groupBy(episodes, (ep) => ep.season));
</script>

<Popover.Root bind:open>
	<Popover.Trigger class="cursor-pointer">
		<Button variant="outline" size="sm" class="w-56 justify-between">
			<span class="truncate">
				{selected ? `${selected.label} — ${selected.description}` : 'Select episode...'}
			</span>
			<ChevronsUpDown class="opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-full md:max-w-124 p-0" align="start">
		<Command.Root>
			<Command.Input placeholder="Search episodes..." />
			<Command.List>
				<Command.Empty>No episodes found.</Command.Empty>
				{#each grouped as [season, eps]}
					<Command.Group heading="Season {season}">
						{#each eps as ep}
							<Command.Item
								value="{ep.label} {ep.description}"
								onSelect={() => {
									selected = ep;
									open = false;
									onchange?.(ep);
								}}
							>
								<div class="p-2 rounded-full flex items-center justify-center font-mono">
									{#if isSelected(ep)}
										<Check />
									{:else}
										<span class="text-xs font-bold uppercase text-muted-foreground"
											>{String(ep.episode).padStart(2, '0')}</span
										>
									{/if}
								</div>
								<div class="flex flex-col gap-0 min-w-0">
									<span class="font-medium">{ep.label}</span>
									<span class="truncate text-muted-foreground">{ep.description}</span>
								</div>
							</Command.Item>
						{/each}
					</Command.Group>
				{/each}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
