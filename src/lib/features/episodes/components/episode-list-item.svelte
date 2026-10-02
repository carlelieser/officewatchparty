<script lang="ts">
	import * as Item from '$lib/components/ui/item';
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Play } from '@lucide/svelte';
	import EpisodeMenu from '$lib/features/episodes/components/episode-menu.svelte';
	import { episodeThumbnailUrl, formatSeasonEpisode } from '$lib/shared/format';
	import type { ItemVariant } from '$lib/components/ui/item/item.svelte';
	import type { Episode } from '$lib/features/episodes/types';

	interface EpisodeListItemProps {
		episode: Episode;
		onselect?: (episode: Episode) => void;
		variant?: ItemVariant;
	}

	let { episode, onselect, variant = 'outline' }: EpisodeListItemProps = $props();

	let thumbnailUrl = $derived(episodeThumbnailUrl(episode.season, episode.episode));
	let metadata = $derived(formatSeasonEpisode(episode.season, episode.episode));
</script>

<Item.Root {variant}>
	<Item.Media variant="image" class="relative h-16 w-32 shrink-0 rounded-md">
		<Skeleton class="absolute inset-0 size-full rounded-none" />
		<img src={thumbnailUrl} alt={episode.label} loading="lazy" class="relative size-full object-cover" />
	</Item.Media>

	<Item.Content>
		<Item.Title>{episode.label}</Item.Title>
		<span class="text-muted-foreground text-xs">{metadata}</span>
		<Item.Description>{episode.description}</Item.Description>
	</Item.Content>

	<Item.Actions>
		<Button size="sm" onclick={() => onselect?.(episode)}>
			<Play class="size-4" />
			<span class="hidden sm:inline">Watch</span>
		</Button>
		<EpisodeMenu {episode} />
	</Item.Actions>
</Item.Root>
