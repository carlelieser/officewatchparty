export type TriviaCategory = 'episodes' | 'characters' | 'cast' | 'production';

export type TriviaDifficulty = 'easy' | 'medium' | 'hard';

export type TriviaSource = {
	title: string;
	publisher: string;
	url: string;
	accessedOn: string;
};

export type TriviaEpisodeReference = {
	season: number;
	episode: number;
};

export type TriviaQuestion = {
	id: string;
	category: TriviaCategory;
	difficulty: TriviaDifficulty;
	question: string;
	choices: Array<string>;
	correctIndex: number;
	explanation: string;
	episode: TriviaEpisodeReference | null;
	sources: Array<TriviaSource>;
};

export type TriviaEpisode = {
	season: number;
	episode: number;
	label: string;
};

export type PublicTriviaQuestion = {
	id: string;
	category: TriviaCategory;
	question: string;
	choices: Array<string>;
	episode: TriviaEpisode | null;
};

export type TriviaResult = {
	selectedIndex: number;
	correctIndex: number;
	isCorrect: boolean;
	explanation: string;
	sources: Array<TriviaSource>;
};

export type DailyTrivia = {
	date: string;
	question: PublicTriviaQuestion;
	result: TriviaResult | null;
};

export type ScheduledTrivia = {
	date: string;
	question: TriviaQuestion;
};

export type TriviaAnswer = {
	triviaDate: string;
	questionId: string;
	selectedIndex: number;
};

export type InsertTriviaAnswerStatus = 'inserted' | 'already_answered';

export type TriviaAnswerRequest = {
	date: string;
	selectedIndex: number;
};

export type TriviaAnswerResponse = {
	result: TriviaResult;
};

export type GradedOutcome = {
	kind: 'graded';
	result: TriviaResult;
};

export type FailedOutcome = {
	kind: 'failed';
	message: string;
};

export type SubmitAnswerOutcome = GradedOutcome | FailedOutcome;

export type SubmitTriviaAnswer = (
	date: string,
	selectedIndex: number
) => Promise<SubmitAnswerOutcome>;
