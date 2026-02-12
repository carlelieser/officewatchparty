<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Empty from '$lib/components/ui/empty';
	import EpisodeCard from '$lib/features/episodes/components/episode-card.svelte';
	import OfficeEpisodeSelect from '$lib/features/episodes/components/office-episode-select.svelte';
	import type { Episode } from '$lib/features/episodes/types';
	import { Button } from '$lib/components/ui/button';
	import { Plus, Heart } from '@lucide/svelte';
	import { addFavorite, removeFavorite } from '$lib/features/favorites/api';

	interface FavoritesProps {
		initial?: Array<Episode>;
		onselect?: (episode: Episode) => void;
	}

	let { initial = [], onselect }: FavoritesProps = $props();

	let favorites: Array<Episode> = $state(initial);
	let dialogOpen = $state(false);
	let pickValue: Episode | null = $state(null);

	function onPick(episode: Episode): void {
		favorites = [...favorites, episode];
		dialogOpen = false;
		addFavorite(episode.season, episode.episode);
	}

	function remove(index: number, clickEvent: Event): void {
		clickEvent.stopPropagation();
		const favorite = favorites[index];
		favorites = favorites.filter((_, filterIndex) => filterIndex !== index);
		removeFavorite(favorite.season, favorite.episode);
	}

	function openAddDialog(): void {
		pickValue = null;
		dialogOpen = true;
	}
</script>

<div class="flex flex-col gap-3 w-full">
	<span class="text-center md:text-left text-xs font-medium uppercase text-muted-foreground"
		>Favorites</span
	>
	{#if favorites.length > 0}
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
			{#each favorites as favorite, index}
				<EpisodeCard
					season={favorite.season}
					episode={favorite.episode}
					label={favorite.label}
					description={favorite.description}
					onclick={() => onselect?.(favorite)}
					onremove={(clickEvent) => remove(index, clickEvent)}
				/>
			{/each}
			<button
				class="aspect-square flex items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors cursor-pointer"
				onclick={openAddDialog}
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
				<Button variant="outline" size="sm" onclick={openAddDialog}>
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
