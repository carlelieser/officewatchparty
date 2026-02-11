<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { X } from '@lucide/svelte';

	interface EpisodeCardProps {
		season?: number | null;
		episode?: number | null;
		label?: string | null;
		description?: string | null;
		onclick?: () => void;
		onremove?: (e: Event) => void;
	}

	let { season, episode, label, description, onclick, onremove }: EpisodeCardProps = $props();

	const pad = (n: number) => String(n).padStart(2, '0');
</script>

<div class="relative group aspect-square">
	<button class="w-full text-left cursor-pointer" {onclick}>
		<Card.Root class="hover:bg-accent aspect-square transition-colors">
			<Card.Header>
				{#if season && episode}
					<span class="text-xs font-mono text-muted-foreground"
						>S{pad(season)}E{pad(episode)}</span
					>
					<Card.Title class="text-sm">{label}</Card.Title>
				{:else}
					<Card.Title class="text-sm text-muted-foreground">No episode selected</Card.Title>
				{/if}
			</Card.Header>
			{#if description}
				<Card.Content>
					<p class="text-xs text-muted-foreground line-clamp-2">{description}</p>
				</Card.Content>
			{/if}
		</Card.Root>
	</button>
	{#if onremove}
		<button
			class="absolute top-2 right-2 size-5 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
			onclick={onremove}
		>
			<X class="size-3" />
		</button>
	{/if}
</div>
