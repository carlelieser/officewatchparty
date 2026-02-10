<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Empty from '$lib/components/ui/empty';
	import OfficeEpisodeSelect from '$lib/components/office-episode-select.svelte';
	import type { Episode } from '$lib/components/episode-select.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Plus, X, Heart } from '@lucide/svelte';

	let {
		initial = [],
		onselect
	}: {
		initial?: Episode[];
		onselect?: (episode: Episode) => void;
	} = $props();

	let favorites: Episode[] = $state(initial);
	let dialogOpen = $state(false);
	let pickValue: Episode | null = $state(null);

	const pad = (n: number) => String(n).padStart(2, '0');

	function onPick(ep: Episode) {
		favorites = [...favorites, ep];
		dialogOpen = false;
		const body = new FormData();
		body.set('season', String(ep.season));
		body.set('episode', String(ep.episode));
		fetch('?/addFavorite', { method: 'POST', body });
	}

	function remove(index: number, e: Event) {
		e.stopPropagation();
		const fav = favorites[index];
		favorites = favorites.filter((_, i) => i !== index);
		const body = new FormData();
		body.set('season', String(fav.season));
		body.set('episode', String(fav.episode));
		fetch('?/removeFavorite', { method: 'POST', body });
	}
</script>

<div class="flex flex-col gap-3 w-full">
	<span class="text-xs font-medium uppercase text-muted-foreground">Favorites</span>
	{#if favorites.length > 0}
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
			{#each favorites as fav, i}
				<div class="relative group aspect-square">
					<button class="w-full text-left cursor-pointer" onclick={() => onselect?.(fav)}>
						<Card.Root class="hover:bg-accent aspect-square transition-colors">
							<Card.Header class="p-3 pb-0">
								<span class="text-xs font-mono text-muted-foreground"
									>S{pad(fav.season)}E{pad(fav.episode)}</span
								>
								<Card.Title class="text-sm">{fav.label}</Card.Title>
							</Card.Header>
							<Card.Content class="p-3 pt-1">
								<p class="text-xs text-muted-foreground line-clamp-2">{fav.description}</p>
							</Card.Content>
						</Card.Root>
					</button>
					<button
						class="absolute top-2 right-2 size-5 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
						onclick={(e) => remove(i, e)}
					>
						<X class="size-3" />
					</button>
				</div>
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
