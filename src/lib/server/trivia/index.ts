import batchOne from './bank/batch-01.json';
import batchTwo from './bank/batch-02.json';
import batchThree from './bank/batch-03.json';
import batchFour from './bank/batch-04.json';
import batchFive from './bank/batch-05.json';
import { Episodes } from '$lib/server/episodes';
import { addDays, daysBetween } from '$lib/features/trivia';
import type {
	DailyTrivia,
	PublicTriviaQuestion,
	ScheduledTrivia,
	TriviaAnswer,
	TriviaEpisode,
	TriviaEpisodeReference,
	TriviaQuestion,
	TriviaResult
} from '$lib/features/trivia';

// Day 0 of the schedule. The bank is append-only: reordering it would change
// which question past days point to.
export const TRIVIA_LAUNCH_DATE = '2026-10-06';

export class Trivia {
	static readonly all = [
		...batchOne,
		...batchTwo,
		...batchThree,
		...batchFour,
		...batchFive
	] as Array<TriviaQuestion>;

	static find(id: string): TriviaQuestion | null {
		return this.all.find((candidate) => candidate.id === id) ?? null;
	}

	static forDate(date: string): TriviaQuestion | null {
		const dayIndex = daysBetween(TRIVIA_LAUNCH_DATE, date);
		if (dayIndex < 0) return null;
		return this.all[dayIndex] ?? null;
	}

	static scheduleThrough(date: string): Array<ScheduledTrivia> {
		const lastIndex = Math.min(daysBetween(TRIVIA_LAUNCH_DATE, date), this.all.length - 1);
		const schedule: Array<ScheduledTrivia> = [];

		for (let index = lastIndex; index >= 0; index--) {
			schedule.push({ date: addDays(TRIVIA_LAUNCH_DATE, index), question: this.all[index] });
		}

		return schedule;
	}
}

function toTriviaEpisode(reference: TriviaEpisodeReference | null): TriviaEpisode | null {
	if (!reference) return null;

	const episode = Episodes.find(reference.season, reference.episode);
	if (!episode) return null;
	return { season: episode.season, episode: episode.episode, label: episode.label };
}

export function toPublicQuestion(question: TriviaQuestion): PublicTriviaQuestion {
	return {
		id: question.id,
		category: question.category,
		question: question.question,
		choices: question.choices,
		episode: toTriviaEpisode(question.episode)
	};
}

export function gradeAnswer(question: TriviaQuestion, selectedIndex: number): TriviaResult {
	return {
		selectedIndex,
		correctIndex: question.correctIndex,
		isCorrect: selectedIndex === question.correctIndex,
		explanation: question.explanation,
		sources: question.sources
	};
}

export function gradeStoredAnswer(answer: TriviaAnswer): TriviaResult {
	const question = Trivia.find(answer.questionId);
	if (!question) {
		throw new Error(
			`Failed to grade trivia answer on ${answer.triviaDate}: unknown question ${answer.questionId}`
		);
	}
	return gradeAnswer(question, answer.selectedIndex);
}

export function toDailyTrivia(
	scheduled: ScheduledTrivia,
	answer: TriviaAnswer | null
): DailyTrivia {
	return {
		date: scheduled.date,
		question: toPublicQuestion(scheduled.question),
		result: answer ? gradeStoredAnswer(answer) : null
	};
}

export function toDailyTriviaList(
	schedule: Array<ScheduledTrivia>,
	answers: Array<TriviaAnswer>
): Array<DailyTrivia> {
	const answersByDate = new Map(answers.map((answer) => [answer.triviaDate, answer]));
	return schedule.map((scheduled) =>
		toDailyTrivia(scheduled, answersByDate.get(scheduled.date) ?? null)
	);
}
