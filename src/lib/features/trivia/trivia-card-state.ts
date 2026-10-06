import { CircleCheck, CircleX } from '@lucide/svelte';
import type { Component } from 'svelte';
import type { BadgeVariant } from '$lib/components/ui/badge';
import type { SubmitAnswerOutcome, TriviaCategory, TriviaResult } from './types';

export type UnansweredState = { status: 'unanswered' };
export type SubmittingState = { status: 'submitting' };
export type CorrectState = { status: 'correct'; result: TriviaResult };
export type IncorrectState = { status: 'incorrect'; result: TriviaResult };
export type ErrorState = { status: 'error'; message: string };

export type TriviaCardState =
	| UnansweredState
	| SubmittingState
	| CorrectState
	| IncorrectState
	| ErrorState;

export type RevealedState = CorrectState | IncorrectState;

export type ChoiceMark = 'correct' | 'incorrect' | 'neutral';

export type MarkPresentation = {
	icon: Component | null;
	description: string;
	rowClass: string;
};

export type VerdictPresentation = {
	label: string;
	icon: Component;
	variant: BadgeVariant;
};

export const categoryLabels: Record<TriviaCategory, string> = {
	episodes: 'Episodes',
	characters: 'Characters',
	cast: 'Cast',
	production: 'Behind the scenes'
};

export const markPresentations: Record<ChoiceMark, MarkPresentation> = {
	correct: {
		icon: CircleCheck,
		description: 'Correct answer',
		rowClass: 'border-primary bg-primary/5 font-medium'
	},
	incorrect: {
		icon: CircleX,
		description: 'Your answer',
		rowClass: 'border-destructive bg-destructive/5 text-destructive'
	},
	neutral: {
		icon: null,
		description: '',
		rowClass: 'text-muted-foreground'
	}
};

export const verdictPresentations: Record<RevealedState['status'], VerdictPresentation> = {
	correct: { label: 'Correct', icon: CircleCheck, variant: 'default' },
	incorrect: { label: 'Incorrect', icon: CircleX, variant: 'destructive' }
};

export function stateFromResult(result: TriviaResult): RevealedState {
	if (result.isCorrect) return { status: 'correct', result };
	return { status: 'incorrect', result };
}

export function initialCardState(result: TriviaResult | null): TriviaCardState {
	if (!result) return { status: 'unanswered' };
	return stateFromResult(result);
}

export function stateFromOutcome(outcome: SubmitAnswerOutcome): TriviaCardState {
	if (outcome.kind === 'failed') return { status: 'error', message: outcome.message };
	return stateFromResult(outcome.result);
}

export function isRevealed(state: TriviaCardState): state is RevealedState {
	return state.status === 'correct' || state.status === 'incorrect';
}

export function markForChoice(result: TriviaResult, choiceIndex: number): ChoiceMark {
	if (choiceIndex === result.correctIndex) return 'correct';
	if (choiceIndex === result.selectedIndex) return 'incorrect';
	return 'neutral';
}
