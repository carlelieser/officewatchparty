import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import {
	TriviaCard,
	type DailyTrivia,
	type SubmitAnswerOutcome,
	type TriviaResult
} from '$lib/features/trivia';

const TODAY = '2026-10-06';

const correctResult: TriviaResult = {
	selectedIndex: 0,
	correctIndex: 0,
	isCorrect: true,
	explanation: 'The theme was written by Jay Ferguson.',
	sources: [
		{
			title: 'The Office (American TV series)',
			publisher: 'Wikipedia',
			url: 'https://en.wikipedia.org/wiki/The_Office_(American_TV_series)',
			accessedOn: '2026-10-05'
		}
	]
};

const incorrectResult: TriviaResult = { ...correctResult, selectedIndex: 2, isCorrect: false };

function createTrivia(result: TriviaResult | null): DailyTrivia {
	return {
		date: TODAY,
		question: {
			id: 'trivia-test',
			category: 'production',
			question: 'Who wrote the theme song?',
			choices: ['Jay Ferguson', 'Mark Mothersbaugh', 'Danny Elfman', 'Jon Brion'],
			episode: null
		},
		result
	};
}

function resolvingTo(outcome: SubmitAnswerOutcome): () => Promise<SubmitAnswerOutcome> {
	return async function submit(): Promise<SubmitAnswerOutcome> {
		return outcome;
	};
}

function neverResolving(): Promise<SubmitAnswerOutcome> {
	return new Promise(function waitForever(): void {});
}

describe('TriviaCard', () => {
	it('disables submit until a choice is picked', async () => {
		render(TriviaCard, { trivia: createTrivia(null), today: TODAY });

		const submitButton = page.getByRole('button', { name: 'Submit' });
		await expect.element(submitButton).toBeDisabled();

		await page.getByLabelText('Mark Mothersbaugh').click();

		await expect.element(submitButton).toBeEnabled();
	});

	it('shows a checking state while the answer is being saved', async () => {
		render(TriviaCard, { trivia: createTrivia(null), today: TODAY, submit: neverResolving });

		await page.getByLabelText('Jay Ferguson').click();
		await page.getByRole('button', { name: 'Submit' }).click();

		await expect.element(page.getByRole('button', { name: /Checking/ })).toBeDisabled();
		await expect.element(page.getByRole('radio', { name: 'Jay Ferguson' })).toBeDisabled();
	});

	it('reveals a correct answer with its source', async () => {
		const submit = resolvingTo({ kind: 'graded', result: correctResult });
		render(TriviaCard, { trivia: createTrivia(null), today: TODAY, submit });

		await page.getByLabelText('Jay Ferguson').click();
		await page.getByRole('button', { name: 'Submit' }).click();

		await expect.element(page.getByText('Correct', { exact: true })).toBeVisible();
		await expect.element(page.getByText(correctResult.explanation)).toBeVisible();
		const citation = page.getByRole('link', { name: /The Office \(American TV series\)/ });
		await expect.element(citation).toHaveAttribute('href', correctResult.sources[0].url);
		await expect.element(page.getByRole('button')).not.toBeInTheDocument();
	});

	it('marks both the wrong pick and the correct answer when incorrect', async () => {
		render(TriviaCard, { trivia: createTrivia(incorrectResult), today: TODAY });

		await expect.element(page.getByText('Incorrect', { exact: true })).toBeVisible();
		const choices = page.getByRole('listitem').filter({ hasText: /Jay Ferguson|Danny Elfman/ });
		await expect
			.element(choices.filter({ hasText: 'Jay Ferguson' }))
			.toHaveTextContent('Correct answer');
		await expect
			.element(choices.filter({ hasText: 'Danny Elfman' }))
			.toHaveTextContent('Your answer');
	});

	it('keeps the selection and offers a retry when saving fails', async () => {
		const submit = resolvingTo({ kind: 'failed', message: 'Could not save.' });
		render(TriviaCard, { trivia: createTrivia(null), today: TODAY, submit });

		await page.getByLabelText('Jon Brion').click();
		await page.getByRole('button', { name: 'Submit' }).click();

		await expect.element(page.getByRole('alert')).toHaveTextContent('Could not save.');
		await expect.element(page.getByRole('radio', { name: 'Jon Brion' })).toBeChecked();
		await expect.element(page.getByRole('button', { name: 'Try again' })).toBeEnabled();
	});

	it('labels today, yesterday and earlier days', async () => {
		render(TriviaCard, { trivia: createTrivia(null), today: TODAY });
		render(TriviaCard, { trivia: { ...createTrivia(null), date: '2026-10-05' }, today: TODAY });
		render(TriviaCard, { trivia: { ...createTrivia(null), date: '2026-10-01' }, today: TODAY });

		await expect.element(page.getByText('Today', { exact: true })).toBeVisible();
		await expect.element(page.getByText('Yesterday', { exact: true })).toBeVisible();
		await expect.element(page.getByText('Thu, Oct 1', { exact: true })).toBeVisible();
	});
});
