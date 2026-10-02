<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from '@lucide/svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { formatSeasonEpisode, episodeThumbnailUrl } from '$lib/shared/format';

	interface EpisodeCardProps {
		season?: number | null;
		episode?: number | null;
		label?: string | null;
		onclick?: () => void;
		onremove?: (event: Event) => void;
		footer?: Snippet;
		menu?: Snippet;
		// Watched fraction (0–1); when > 0 a progress bar is shown along the bottom.
		progress?: number;
	}

	let { season, episode, label, onclick, onremove, footer, menu, progress = 0 }: EpisodeCardProps =
		$props();

	let progressPercent = $derived(Math.min(100, Math.max(0, progress * 100)));

	let hasEpisode = $derived(Boolean(season && episode));
	let thumbnailUrl = $derived(hasEpisode ? episodeThumbnailUrl(season!, episode!) : null);
	let metadata = $derived(hasEpisode ? formatSeasonEpisode(season!, episode!) : null);
</script>

<div class="relative group">
	<button class="w-full text-left cursor-pointer" {onclick}>
		<div
			class="relative aspect-[2/1] overflow-hidden rounded-xl border bg-muted transition-colors hover:border-muted-foreground/40"
		>
			<Skeleton class="absolute inset-0 size-full rounded-none" />
			{#if thumbnailUrl}
				<img
					src={thumbnailUrl}
					alt={label ?? 'Episode thumbnail'}
					loading="lazy"
					class="relative size-full object-cover"
				/>
			{/if}

			<div
				class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
			></div>

			<div class="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3">
				{#if hasEpisode}
					<span class="line-clamp-1 text-sm font-medium text-white">{label}</span>
					<span class="text-xs text-white/70">{metadata}</span>
				{:else}
					<span class="text-sm font-medium text-white/70">No episode selected</span>
				{/if}
			</div>

			{#if footer}
				<div class="absolute right-3 top-3">
					{@render footer()}
				</div>
			{/if}

			{#if progressPercent > 0}
				<div class="absolute inset-x-0 bottom-0 h-1 bg-white/25">
					<div class="h-full bg-primary" style="width: {progressPercent}%"></div>
				</div>
			{/if}
		</div>
	</button>

	{#if onremove}
		<button
			class="absolute left-2 top-2 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
			onclick={onremove}
		>
			<X class="size-3" />
		</button>
	{/if}

	{#if menu}
		<div class="absolute right-2 top-2">
			{@render menu()}
		</div>
	{/if}
</div>
