<script lang="ts">
	import TriviaChoiceResult from './trivia-choice-result.svelte';
	import { markForChoice } from '../trivia-card-state';
	import type { TriviaResult } from '../types';

	type TriviaResultChoicesProps = {
		choices: Array<string>;
		result: TriviaResult;
	};

	let { choices, result }: TriviaResultChoicesProps = $props();
</script>

<ul class="flex flex-col gap-2" aria-label="Answer choices">
	{#each choices as choice, index (index)}
		<TriviaChoiceResult {choice} mark={markForChoice(result, index)} />
	{/each}
</ul>
