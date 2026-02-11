<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Empty from '$lib/components/ui/empty';
	import EpisodeCard from '$lib/components/episode-card.svelte';
	import OfficeEpisodeSelect from '$lib/components/office-episode-select.svelte';
	import type { Episode } from '$lib/types';
	import { Button } from '$lib/components/ui/button';
	import { Plus, Heart } from '@lucide/svelte';

	interface FavoritesProps {
		initial?: Episode[];
		onselect?: (episode: Episode) => void;
	}

	let { initial = [], onselect }: FavoritesProps = $props();

	let favorites: Episode[] = $state(initial);
	let dialogOpen = $state(false);
	let pickValue: Episode | null = $state(null);

	function onPick(ep: Episode) {
		favorites = [...favorites, ep];
		dialogOpen = false;
		fetch('/api/favorites', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ season: ep.season, episode: ep.episode })
		});
	}

	function remove(index: number, e: Event) {
		e.stopPropagation();
		const fav = favorites[index];
		favorites = favorites.filter((_, i) => i !== index);
		fetch('/api/favorites', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ season: fav.season, episode: fav.episode })
		});
	}
</script>

<div class="flex flex-col gap-3 w-full">
	<span class="text-center md:text-left text-xs font-medium uppercase text-muted-foreground">Favorites</span>
	{#if favorites.length > 0}
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
			{#each favorites as fav, i}
				<EpisodeCard
					season={fav.season}
					episode={fav.episode}
					label={fav.label}
					description={fav.description}
					onclick={() => onselect?.(fav)}
					onremove={(e) => remove(i, e)}
				/>
			{/each}
			<button
				class="aspect-square flex items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors cursor-pointer"
				onclick={() => {
					pickValue = null;
					dialogOpen = true;
				}}
			>
				<Plus class="size-5 text-muted-foreground/50" />
			</button>
		</div>
	{:else}
		<Empty.Root>
			<Empty.Content>
				<Empty.Media>
					<Heart class="size-8 text-muted-foreground" />
				</Empty.Media>
				<Empty.Title>No favorites yet</Empty.Title>
				<Empty.Description>Save your favorite episodes for quick access.</Empty.Description>
				<Button
					variant="outline"
					size="sm"
					onclick={() => {
						pickValue = null;
						dialogOpen = true;
					}}
				>
					<Plus class="size-4" /> Add a favorite
				</Button>
			</Empty.Content>
		</Empty.Root>
	{/if}
</div>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Add a favorite</Dialog.Title>
			<Dialog.Description>Pick an episode to add to your favorites.</Dialog.Description>
		</Dialog.Header>
		<div class="py-2">
			<OfficeEpisodeSelect bind:selected={pickValue} onchange={onPick} />
		</div>
	</Dialog.Content>
</Dialog.Root>
