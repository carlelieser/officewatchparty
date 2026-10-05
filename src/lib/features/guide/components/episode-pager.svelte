<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { episodeGuidePath } from '../paths';
	import { formatEpisodeCode } from '$lib/shared/format';
	import type { Episode } from '$lib/features/episodes/types';

	interface EpisodePagerProps {
		previous: Episode | null;
		next: Episode | null;
	}

	let { previous, next }: EpisodePagerProps = $props();
</script>

<nav aria-label="Episodes" class="flex flex-col gap-2 sm:flex-row sm:justify-between">
	{#if previous}
		<Button
			variant="outline"
			class="h-auto max-w-full justify-start py-2"
			href={resolve(episodeGuidePath(previous))}
		>
			<ChevronLeft />
			<span class="flex min-w-0 flex-col items-start">
				<span class="text-xs text-muted-foreground"
					>Previous · {formatEpisodeCode(previous.season, previous.episode)}</span
				>
				<span class="truncate">{previous.label}</span>
			</span>
		</Button>
	{/if}

	{#if next}
		<Button
			variant="outline"
			class="h-auto max-w-full justify-end py-2 sm:ml-auto"
			href={resolve(episodeGuidePath(next))}
		>
			<span class="flex min-w-0 flex-col items-end">
				<span class="text-xs text-muted-foreground"
					>Next · {formatEpisodeCode(next.season, next.episode)}</span
				>
				<span class="truncate">{next.label}</span>
			</span>
			<ChevronRight />
		</Button>
	{/if}
</nav>
