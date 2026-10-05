<script lang="ts">
	import * as Item from '$lib/components/ui/item';
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Play } from '@lucide/svelte';
	import EpisodeMenu from '$lib/features/episodes/components/episode-menu.svelte';
	import { episodeThumbnailUrl, formatSeasonEpisode } from '$lib/shared/format';
	import type { ItemVariant } from '$lib/components/ui/item/item.svelte';
	import type { Episode } from '$lib/features/episodes/types';
	import type { ResolvedPathname } from '$app/types';

	interface EpisodeListItemProps {
		episode: Episode;
		onselect?: (episode: Episode) => void;
		// When set, the whole row is a link and the watch/menu actions are omitted.
		href?: ResolvedPathname;
		variant?: ItemVariant;
	}

	let { episode, onselect, href, variant = 'outline' }: EpisodeListItemProps = $props();

	let thumbnailUrl = $derived(episodeThumbnailUrl(episode.season, episode.episode));
	let metadata = $derived(formatSeasonEpisode(episode.season, episode.episode));

	function handleWatchClick(): void {
		onselect?.(episode);
	}
</script>

{#snippet details()}
	<Item.Media variant="image" class="relative h-16 w-32 shrink-0 rounded-md">
		<Skeleton class="absolute inset-0 size-full rounded-none" />
		<img
			src={thumbnailUrl}
			alt={episode.label}
			loading="lazy"
			class="relative size-full object-cover"
		/>
	</Item.Media>

	<Item.Content>
		<Item.Title>{episode.label}</Item.Title>
		<span class="text-muted-foreground text-xs">{metadata}</span>
		<Item.Description>{episode.description}</Item.Description>
	</Item.Content>
{/snippet}

{#if href}
	<Item.Root {variant}>
		{#snippet child({ props })}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- href is typed as an already-resolved pathname -->
			<a {href} {...props}>
				{@render details()}
			</a>
		{/snippet}
	</Item.Root>
{:else}
	<Item.Root {variant}>
		{@render details()}

		<Item.Actions>
			<Button size="sm" onclick={handleWatchClick}>
				<Play class="size-4" />
				<span class="hidden sm:inline">Watch</span>
			</Button>
			<EpisodeMenu {episode} />
		</Item.Actions>
	</Item.Root>
{/if}
