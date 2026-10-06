<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import type { TriviaCardState } from '../trivia-card-state';

	type TriviaCardFooterProps = {
		state: TriviaCardState;
		hasSelection: boolean;
		onsubmit: () => void;
	};

	let { state, hasSelection, onsubmit }: TriviaCardFooterProps = $props();

	let isSubmitting = $derived(state.status === 'submitting');
	let isError = $derived(state.status === 'error');
	let canSubmit = $derived(hasSelection && !isSubmitting);
</script>

<Card.Footer class="flex flex-col items-stretch gap-3">
	{#if state.status === 'error'}
		<p role="alert" class="text-sm text-destructive">{state.message}</p>
	{/if}
	<Button onclick={onsubmit} disabled={!canSubmit} class="w-full sm:w-fit sm:self-end">
		{#if isSubmitting}
			<Spinner />
			Checking…
		{:else if isError}
			Try again
		{:else}
			Submit
		{/if}
	</Button>
</Card.Footer>
