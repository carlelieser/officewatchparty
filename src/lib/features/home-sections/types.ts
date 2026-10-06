import type { Snippet } from 'svelte';
import type { HomeSectionKey } from './home-section-keys';

export type HomeSection = {
	key: HomeSectionKey;
	title: string;
	seeAllHref?: string;
	isAvailable: boolean;
	content: Snippet;
};

export type SectionVisibilityRequest = {
	section: HomeSectionKey;
};

export type SavedOutcome = {
	kind: 'saved';
};

export type SaveFailedOutcome = {
	kind: 'failed';
};

export type SaveVisibilityOutcome = SavedOutcome | SaveFailedOutcome;

export type SaveSectionVisibility = (
	section: HomeSectionKey,
	isHidden: boolean
) => Promise<SaveVisibilityOutcome>;
