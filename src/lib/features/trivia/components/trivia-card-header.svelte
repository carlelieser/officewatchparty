<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import TriviaEpisodeLink from './trivia-episode-link.svelte';
	import { categoryLabels } from '../trivia-card-state';
	import type { PublicTriviaQuestion } from '../types';

	type TriviaCardHeaderProps = {
		question: PublicTriviaQuestion;
		dateLabel: string;
		titleId: string;
	};

	let { question, dateLabel, titleId }: TriviaCardHeaderProps = $props();
</script>

<Card.Header>
	<Card.Description class="flex flex-wrap items-center gap-2 text-xs">
		<Badge variant="secondary">{dateLabel}</Badge>
		<Badge variant="secondary">{categoryLabels[question.category]}</Badge>
	</Card.Description>
	<Card.Title id={titleId} class="text-base leading-snug">{question.question}</Card.Title>
	{#if question.episode}
		<TriviaEpisodeLink episode={question.episode} />
	{/if}
</Card.Header>
