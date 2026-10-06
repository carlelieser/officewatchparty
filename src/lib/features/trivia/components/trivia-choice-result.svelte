<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { ChoiceMark } from '../trivia-card-state';
	import { markPresentations } from '../trivia-card-state';

	type TriviaChoiceResultProps = {
		choice: string;
		mark: ChoiceMark;
	};

	let { choice, mark }: TriviaChoiceResultProps = $props();

	let presentation = $derived(markPresentations[mark]);
</script>

<li
	class={cn(
		'flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm',
		presentation.rowClass
	)}
>
	<span>{choice}</span>
	{#if presentation.icon}
		<presentation.icon class="size-4 shrink-0" aria-hidden="true" />
		<span class="sr-only">{presentation.description}</span>
	{/if}
</li>
