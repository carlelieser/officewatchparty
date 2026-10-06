<script lang="ts">
	import { ExternalLink } from '@lucide/svelte';
	import type { TriviaSource } from '../types';

	type TriviaCitationProps = {
		source: TriviaSource;
	};

	let { source }: TriviaCitationProps = $props();
</script>

<li class="flex flex-col gap-0.5">
	<a
		href={source.url}
		target="_blank"
		rel="noopener noreferrer external"
		class="inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
	>
		{source.title}
		<ExternalLink class="size-3 shrink-0" aria-hidden="true" />
		<span class="sr-only">(opens in a new tab)</span>
	</a>
	<span class="text-muted-foreground">
		{source.publisher} · Accessed <time datetime={source.accessedOn}>{source.accessedOn}</time>
	</span>
</li>
