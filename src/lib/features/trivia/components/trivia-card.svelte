<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import TriviaCardHeader from './trivia-card-header.svelte';
	import TriviaCardFooter from './trivia-card-footer.svelte';
	import TriviaChoices from './trivia-choices.svelte';
	import TriviaResultChoices from './trivia-result-choices.svelte';
	import TriviaReveal from './trivia-reveal.svelte';
	import { submitTriviaAnswer } from '../api';
	import { formatTriviaDate } from '../trivia-date';
	import {
		initialCardState,
		isRevealed,
		stateFromOutcome,
		type TriviaCardState
	} from '../trivia-card-state';
	import type { DailyTrivia, SubmitTriviaAnswer } from '../types';

	type TriviaCardProps = {
		trivia: DailyTrivia;
		today: string;
		submit?: SubmitTriviaAnswer;
	};

	let { trivia, today, submit = submitTriviaAnswer }: TriviaCardProps = $props();

	const titleId = $props.id();

	// The card owns its state after the first render; later prop updates are
	// not answers the user made here.
	// svelte-ignore state_referenced_locally
	let cardState: TriviaCardState = $state(initialCardState(trivia.result));
	let selectedValue = $state('');

	let dateLabel = $derived(formatTriviaDate(trivia.date, today));
	let hasSelection = $derived(selectedValue !== '');

	async function handleSubmit(): Promise<void> {
		cardState = { status: 'submitting' };
		const outcome = await submit(trivia.date, Number(selectedValue));
		cardState = stateFromOutcome(outcome);
	}
</script>

<Card.Root class="gap-4" aria-labelledby={titleId}>
	<TriviaCardHeader question={trivia.question} {dateLabel} {titleId} />
	<Card.Content class="flex flex-col gap-4">
		{#if isRevealed(cardState)}
			<TriviaResultChoices choices={trivia.question.choices} result={cardState.result} />
		{:else}
			<TriviaChoices
				choices={trivia.question.choices}
				bind:value={selectedValue}
				isDisabled={cardState.status === 'submitting'}
				labelledBy={titleId}
			/>
		{/if}
		<div aria-live="polite">
			{#if isRevealed(cardState)}
				<TriviaReveal state={cardState} />
			{/if}
		</div>
	</Card.Content>
	{#if !isRevealed(cardState)}
		<TriviaCardFooter state={cardState} {hasSelection} onsubmit={handleSubmit} />
	{/if}
</Card.Root>
