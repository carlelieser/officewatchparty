import type { SupabaseClient } from '@supabase/supabase-js';
import type { InsertTriviaAnswerStatus, TriviaAnswer } from '$lib/features/trivia';

type TriviaAnswerRow = {
	trivia_date: string;
	question_id: string;
	selected_index: number;
};

export type TriviaAnswersRepo = {
	findByUserId: (userId: string) => Promise<Array<TriviaAnswer>>;
	findByDate: (userId: string, date: string) => Promise<TriviaAnswer | null>;
	insert: (userId: string, answer: TriviaAnswer) => Promise<InsertTriviaAnswerStatus>;
};

const UNIQUE_VIOLATION = '23505';
const ANSWER_COLUMNS = 'trivia_date, question_id, selected_index';

function toTriviaAnswer(row: TriviaAnswerRow): TriviaAnswer {
	return {
		triviaDate: row.trivia_date,
		questionId: row.question_id,
		selectedIndex: row.selected_index
	};
}

export function createTriviaAnswersRepo(supabase: SupabaseClient): TriviaAnswersRepo {
	return {
		async findByUserId(userId: string): Promise<Array<TriviaAnswer>> {
			const { data, error } = await supabase
				.from('trivia_answers')
				.select(ANSWER_COLUMNS)
				.eq('user_id', userId)
				.order('trivia_date', { ascending: false });

			if (error) {
				throw new Error(`Failed to load trivia answers for user ${userId}: ${error.message}`);
			}
			return data.map(toTriviaAnswer);
		},

		async findByDate(userId: string, date: string): Promise<TriviaAnswer | null> {
			const { data, error } = await supabase
				.from('trivia_answers')
				.select(ANSWER_COLUMNS)
				.eq('user_id', userId)
				.eq('trivia_date', date)
				.maybeSingle();

			if (error) {
				throw new Error(
					`Failed to load trivia answer for user ${userId} on ${date}: ${error.message}`
				);
			}
			return data ? toTriviaAnswer(data) : null;
		},

		async insert(userId: string, answer: TriviaAnswer): Promise<InsertTriviaAnswerStatus> {
			const { error } = await supabase.from('trivia_answers').insert({
				user_id: userId,
				trivia_date: answer.triviaDate,
				question_id: answer.questionId,
				selected_index: answer.selectedIndex
			});

			if (!error) return 'inserted';
			if (error.code === UNIQUE_VIOLATION) return 'already_answered';
			throw new Error(
				`Failed to insert trivia answer for user ${userId} on ${answer.triviaDate}: ${error.message}`
			);
		}
	};
}
