export type Episode = {
	season: number;
	episode: number;
	label: string;
	description: string;
};

export type Season = {
	season: number;
	episodes: Array<Episode>;
};

export type ContinueWatchingItem = {
	episode: Episode;
	progressSeconds: number;
	durationSeconds: number;
};

export type ResumePoint = {
	season: number;
	episode: number;
	timeSeconds: number;
};
