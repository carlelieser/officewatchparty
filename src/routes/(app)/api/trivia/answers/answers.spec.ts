import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './+server';
import { TRIVIA_LAUNCH_DATE, Trivia } from '$lib/server/trivia';
import {
	addDays,
	type InsertTriviaAnswerStatus,
	type TriviaAnswer,
	type TriviaQuestion
} from '$lib/features/trivia';
import type { TriviaAnswersRepo } from '$lib/server/repos/trivia-answers';

type AnswerEvent = Parameters<typeof POST>[0];

const USER_ID = 'user-1';
const TODAY = addDays(TRIVIA_LAUNCH_DATE, 1);

function scheduledQuestion(date: string): TriviaQuestion {
	const question = Trivia.forDate(date);
	if (!question) throw new Error(`No trivia is scheduled for ${date}`);
	return question;
}

function createFakeRepo(stored: Array<TriviaAnswer>): TriviaAnswersRepo {
	return {
		async findByUserId(): Promise<Array<TriviaAnswer>> {
			return stored;
		},
		async findByDate(_userId: string, date: string): Promise<TriviaAnswer | null> {
			return stored.find((answer) => answer.triviaDate === date) ?? null;
		},
		async insert(_userId: string, answer: TriviaAnswer): Promise<InsertTriviaAnswerStatus> {
			const isAnswered = stored.some((existing) => existing.triviaDate === answer.triviaDate);
			if (isAnswered) return 'already_answered';
			stored.push(answer);
			return 'inserted';
		}
	};
}

function createEvent(body: string, repo: TriviaAnswersRepo): AnswerEvent {
	const request = new Request('http://localhost/api/trivia/answers', { method: 'POST', body });
	const locals = { user: { id: USER_ID }, repos: { triviaAnswers: repo } };
	return { request, locals } as unknown as AnswerEvent;
}

function answerBody(date: string, selectedIndex: unknown): string {
	return JSON.stringify({ date, selectedIndex });
}

describe('POST /api/trivia/answers', () => {
	const question = scheduledQuestion(TODAY);
	const wrongIndex = (question.correctIndex + 1) % question.choices.length;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(`${TODAY}T12:00:00Z`));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('saves and grades a first answer', async () => {
		const stored: Array<TriviaAnswer> = [];
		const response = await POST(createEvent(answerBody(TODAY, wrongIndex), createFakeRepo(stored)));

		expect(response.status).toBe(200);
		const body = await response.json();
		expect(body.result).toMatchObject({ selectedIndex: wrongIndex, isCorrect: false });
		expect(stored).toEqual([
			{ triviaDate: TODAY, questionId: question.id, selectedIndex: wrongIndex }
		]);
	});

	it('lets a missed past day be answered', async () => {
		const response = await POST(createEvent(answerBody(TRIVIA_LAUNCH_DATE, 0), createFakeRepo([])));

		expect(response.status).toBe(200);
	});

	it('returns the stored answer when the day was already answered', async () => {
		const existing = { triviaDate: TODAY, questionId: question.id, selectedIndex: wrongIndex };
		const repo = createFakeRepo([existing]);

		const response = await POST(createEvent(answerBody(TODAY, question.correctIndex), repo));

		expect(response.status).toBe(409);
		const body = await response.json();
		expect(body.result).toMatchObject({ selectedIndex: wrongIndex, isCorrect: false });
	});

	it.each([
		['a future date', answerBody(addDays(TODAY, 1), 0)],
		['a date before launch', answerBody(addDays(TRIVIA_LAUNCH_DATE, -1), 0)],
		['an invalid date', answerBody('2026-02-30', 0)],
		['an out-of-range choice', answerBody(TODAY, 4)],
		['a non-integer choice', answerBody(TODAY, '1')],
		['malformed JSON', '{']
	])('rejects %s', async (_label, body) => {
		await expect(POST(createEvent(body, createFakeRepo([])))).rejects.toMatchObject({
			status: 400
		});
	});
});
