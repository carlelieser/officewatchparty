import type { PageServerLoad } from './$types';
import { Trivia, toDailyTriviaList } from '$lib/server/trivia';
import { utcDateKey } from '$lib/features/trivia';

export const load: PageServerLoad = async ({ locals }) => {
	const today = utcDateKey(new Date());
	const answers = await locals.repos.triviaAnswers.findByUserId(locals.user.id);
	const history = toDailyTriviaList(Trivia.scheduleThrough(today), answers);

	const current = history.find((trivia) => trivia.date === today) ?? null;
	const previous = history.filter((trivia) => trivia.date !== today);

	return { today, current, previous };
};
