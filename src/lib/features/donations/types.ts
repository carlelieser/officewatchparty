export type DonationPromptState = {
	episodes_completed: number;
	dismissed_count: number;
	last_dismissed_at: string | null;
	donated_at: string | null;
};

export type DonationPromptContext = {
	state: DonationPromptState;
	isOwner: boolean;
	episodesThisSession: number;
	shownThisSession: boolean;
	now: Date;
};

export type DonationPromptDecision = {
	shouldShow: boolean;
	reason: DonationPromptSkipReason | 'eligible';
};

export type DonationPromptSkipReason =
	| 'not-owner'
	| 'already-donated'
	| 'too-few-episodes-this-session'
	| 'too-few-episodes'
	| 'within-cooldown'
	| 'dismissed-permanently'
	| 'already-shown-this-session';
