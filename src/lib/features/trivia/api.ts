import type {
	SubmitAnswerOutcome,
	TriviaAnswerRequest,
	TriviaAnswerResponse
} from '$lib/features/trivia/types';

const SUBMIT_FAILED_MESSAGE = "We couldn't save your answer. Check your connection and try again.";

function isGradedStatus(status: number): boolean {
	return status === 200 || status === 409;
}

export async function submitTriviaAnswer(
	date: string,
	selectedIndex: number
): Promise<SubmitAnswerOutcome> {
	const payload: TriviaAnswerRequest = { date, selectedIndex };

	try {
		const response = await fetch('/api/trivia/answers', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (!isGradedStatus(response.status)) {
			return { kind: 'failed', message: SUBMIT_FAILED_MESSAGE };
		}

		const body: TriviaAnswerResponse = await response.json();
		return { kind: 'graded', result: body.result };
	} catch {
		return { kind: 'failed', message: SUBMIT_FAILED_MESSAGE };
	}
}
