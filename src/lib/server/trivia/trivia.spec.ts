import { describe, expect, it } from 'vitest';
import { Episodes } from '$lib/server/episodes';
import { addDays, type TriviaQuestion } from '$lib/features/trivia';
import {
	TRIVIA_LAUNCH_DATE,
	Trivia,
	gradeAnswer,
	toDailyTriviaList,
	toPublicQuestion
} from './index';

const MAX_QUESTION_LENGTH = 140;
const CHOICE_COUNT = 4;

function describeQuestion(question: TriviaQuestion): string {
	return `${question.id}: ${question.question}`;
}

describe('trivia bank', () => {
	it('has unique ids', () => {
		const ids = Trivia.all.map((question) => question.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it.each(Trivia.all.map((question) => [describeQuestion(question), question] as const))(
		'%s is well-formed',
		(_label, question) => {
			expect(question.question.length).toBeLessThanOrEqual(MAX_QUESTION_LENGTH);
			expect(question.choices).toHaveLength(CHOICE_COUNT);
			expect(new Set(question.choices).size).toBe(CHOICE_COUNT);
			expect(question.correctIndex).toBeGreaterThanOrEqual(0);
			expect(question.correctIndex).toBeLessThan(CHOICE_COUNT);
			expect(question.explanation.trim()).not.toBe('');
			expect(question.sources.length).toBeGreaterThan(0);

			for (const source of question.sources) {
				expect(source.url).toMatch(/^https:\/\//);
				expect(source.accessedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
			}

			if (question.episode) {
				expect(Episodes.find(question.episode.season, question.episode.episode)).not.toBeNull();
			}
		}
	);
});

describe('Trivia schedule', () => {
	it('has no question before launch', () => {
		expect(Trivia.forDate(addDays(TRIVIA_LAUNCH_DATE, -1))).toBeNull();
	});

	it('starts with the first question on launch day', () => {
		expect(Trivia.forDate(TRIVIA_LAUNCH_DATE)).toEqual(Trivia.all[0]);
	});

	it('has no question once the bank runs out', () => {
		expect(Trivia.forDate(addDays(TRIVIA_LAUNCH_DATE, Trivia.all.length))).toBeNull();
	});

	it('lists every scheduled day through a date, newest first', () => {
		const schedule = Trivia.scheduleThrough(addDays(TRIVIA_LAUNCH_DATE, 2));

		expect(schedule.map((scheduled) => scheduled.date)).toEqual([
			addDays(TRIVIA_LAUNCH_DATE, 2),
			addDays(TRIVIA_LAUNCH_DATE, 1),
			TRIVIA_LAUNCH_DATE
		]);
		expect(schedule[2].question).toEqual(Trivia.all[0]);
	});

	it('is empty before launch', () => {
		expect(Trivia.scheduleThrough(addDays(TRIVIA_LAUNCH_DATE, -1))).toEqual([]);
	});
});

describe('grading', () => {
	const question = Trivia.all[0];
	const wrongIndex = (question.correctIndex + 1) % CHOICE_COUNT;

	it('never exposes the answer before grading', () => {
		const publicQuestion = toPublicQuestion(question);
		expect(publicQuestion).not.toHaveProperty('correctIndex');
		expect(publicQuestion).not.toHaveProperty('explanation');
		expect(publicQuestion).not.toHaveProperty('sources');
	});

	it('grades the correct choice as correct', () => {
		expect(gradeAnswer(question, question.correctIndex).isCorrect).toBe(true);
	});

	it('grades any other choice as incorrect', () => {
		const result = gradeAnswer(question, wrongIndex);
		expect(result.isCorrect).toBe(false);
		expect(result.correctIndex).toBe(question.correctIndex);
	});

	it('attaches stored answers to their day', () => {
		const schedule = Trivia.scheduleThrough(addDays(TRIVIA_LAUNCH_DATE, 1));
		const answer = { triviaDate: TRIVIA_LAUNCH_DATE, questionId: question.id, selectedIndex: 0 };

		const [unanswered, answered] = toDailyTriviaList(schedule, [answer]);

		expect(unanswered.result).toBeNull();
		expect(answered.result?.selectedIndex).toBe(0);
	});
});
