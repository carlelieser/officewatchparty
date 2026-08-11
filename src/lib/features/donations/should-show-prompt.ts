import type { DonationPromptContext, DonationPromptDecision } from './types';

export const MINIMUM_EPISODES_BEFORE_PROMPT = 3;
export const MINIMUM_EPISODES_THIS_SESSION = 3;
export const DISMISS_COOLDOWN_DAYS = 90;
export const MAXIMUM_DISMISSALS = 2;

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

function daysSince(timestamp: string, now: Date): number {
	const dismissedAt = new Date(timestamp).getTime();
	const elapsed = now.getTime() - dismissedAt;
	return elapsed / MILLISECONDS_PER_DAY;
}

export function shouldShowDonationPrompt(
	context: DonationPromptContext
): DonationPromptDecision {
	const { state, isOwner, episodesThisSession, shownThisSession, now } = context;

	if (!isOwner) {
		return { shouldShow: false, reason: 'not-owner' };
	}

	if (state.donated_at !== null) {
		return { shouldShow: false, reason: 'already-donated' };
	}

	if (shownThisSession) {
		return { shouldShow: false, reason: 'already-shown-this-session' };
	}

	if (episodesThisSession < MINIMUM_EPISODES_THIS_SESSION) {
		return { shouldShow: false, reason: 'too-few-episodes-this-session' };
	}

	if (state.episodes_completed < MINIMUM_EPISODES_BEFORE_PROMPT) {
		return { shouldShow: false, reason: 'too-few-episodes' };
	}

	if (state.dismissed_count >= MAXIMUM_DISMISSALS) {
		return { shouldShow: false, reason: 'dismissed-permanently' };
	}

	if (state.last_dismissed_at !== null) {
		const elapsedDays = daysSince(state.last_dismissed_at, now);
		if (elapsedDays < DISMISS_COOLDOWN_DAYS) {
			return { shouldShow: false, reason: 'within-cooldown' };
		}
	}

	return { shouldShow: true, reason: 'eligible' };
}
