<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import TriviaCitation from './trivia-citation.svelte';
	import { verdictPresentations, type RevealedState } from '../trivia-card-state';

	type TriviaRevealProps = {
		state: RevealedState;
	};

	let { state }: TriviaRevealProps = $props();

	let verdict = $derived(verdictPresentations[state.status]);
</script>

<div class="flex flex-col gap-3 text-sm">
	<Badge variant={verdict.variant}>
		<verdict.icon aria-hidden="true" />
		{verdict.label}
	</Badge>
	<p>{state.result.explanation}</p>
	<div class="flex flex-col gap-1.5">
		<span class="text-xs font-medium uppercase text-muted-foreground">
			{state.result.sources.length === 1 ? 'Source' : 'Sources'}
		</span>
		<ul class="flex flex-col gap-2 text-xs">
			{#each state.result.sources as source (source.url)}
				<TriviaCitation {source} />
			{/each}
		</ul>
	</div>
</div>
