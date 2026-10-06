import type { MockPlayback, MockReaction, MockViewer } from './types';

export const MOCK_VIEWERS: Array<MockViewer> = [
	{ name: 'Michael', initials: 'MS' },
	{ name: 'Dwight', initials: 'DS' },
	{ name: 'Jim', initials: 'JH' },
	{ name: 'Pam', initials: 'PB' }
];

export const MOCK_VIEWER_OVERFLOW_COUNT = 2;

export const MOCK_REACTIONS: Array<MockReaction> = [
	{ emoji: '😂', delaySeconds: 0, leftPercent: 6 },
	{ emoji: '🔥', delaySeconds: 1.2, leftPercent: 18 },
	{ emoji: '👏', delaySeconds: 2.4, leftPercent: 11 },
	{ emoji: '😭', delaySeconds: 3.6, leftPercent: 26 },
	{ emoji: '💀', delaySeconds: 4.8, leftPercent: 15 }
];

export const MOCK_PLAYBACK: MockPlayback = {
	elapsedLabel: '12:48',
	durationLabel: '21:30',
	progressPercent: 46
};
