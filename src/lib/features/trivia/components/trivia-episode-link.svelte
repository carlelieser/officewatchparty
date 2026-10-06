<script lang="ts">
	import { resolve } from '$app/paths';
	import { Play } from '@lucide/svelte';
	import { formatEpisodeCode } from '$lib/shared/format';
	import type { TriviaEpisode } from '../types';

	type TriviaEpisodeLinkProps = {
		episode: TriviaEpisode;
	};

	let { episode }: TriviaEpisodeLinkProps = $props();

	let href = $derived(`${resolve('/watch')}?season=${episode.season}&episode=${episode.episode}`);
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- resolve() does not accept query strings; the path is resolved -->
<a
	{href}
	class="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
>
	<Play class="size-3" aria-hidden="true" />
	{formatEpisodeCode(episode.season, episode.episode)} · {episode.label}
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
