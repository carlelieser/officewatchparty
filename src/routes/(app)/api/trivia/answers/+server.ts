import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Trivia, gradeAnswer, gradeStoredAnswer } from '$lib/server/trivia';
import {
	daysBetween,
	isDateKey,
	utcDateKey,
	type TriviaAnswerRequest,
	type TriviaAnswerResponse
} from '$lib/features/trivia';

type AnswerBody = {
	date?: unknown;
	selectedIndex?: unknown;
};

function isInteger(value: unknown): value is number {
	return Number.isInteger(value);
}

async function readAnswerRequest(request: Request): Promise<TriviaAnswerRequest> {
	const body: AnswerBody = await request.json().catch(function rejectMalformedJson(): never {
		error(400, 'Request body must be JSON');
	});

	if (!isDateKey(body.date)) error(400, 'date must be a YYYY-MM-DD string');
	if (!isInteger(body.selectedIndex)) error(400, 'selectedIndex must be an integer');
	return { date: body.date, selectedIndex: body.selectedIndex };
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { date, selectedIndex } = await readAnswerRequest(request);

	const isFutureDate = daysBetween(utcDateKey(new Date()), date) > 0;
	if (isFutureDate) error(400, 'Trivia for that date is not available yet');

	const question = Trivia.forDate(date);
	if (!question) error(400, 'No trivia is scheduled for that date');

	const isChoiceInRange = selectedIndex >= 0 && selectedIndex < question.choices.length;
	if (!isChoiceInRange) error(400, 'selectedIndex is out of range');

	const answer = { triviaDate: date, questionId: question.id, selectedIndex };
	const status = await locals.repos.triviaAnswers.insert(locals.user.id, answer);

	if (status === 'inserted') {
		const response: TriviaAnswerResponse = { result: gradeAnswer(question, selectedIndex) };
		return json(response);
	}

	const stored = await locals.repos.triviaAnswers.findByDate(locals.user.id, date);
	if (!stored) error(500, `Trivia answer for ${date} conflicted but could not be loaded`);

	const response: TriviaAnswerResponse = { result: gradeStoredAnswer(stored) };
	return json(response, { status: 409 });
};
