import { Heart, Lightbulb, MessageSquare, PartyPopper, SmilePlus, BookOpen } from '@lucide/svelte';
import type { LandingFeature } from './types';

export const LANDING_FEATURES: Array<LandingFeature> = [
	{
		title: 'Synced watch parties',
		description:
			'Create a private room, add friends by email, and watch with playback kept in sync for everyone.',
		icon: PartyPopper
	},
	{
		title: 'Live reactions',
		description: 'React to the moments that land, and see your friends react as they happen.',
		icon: SmilePlus
	},
	{
		title: 'Episode comments',
		description: 'Talk about every episode with other fans in its comment thread.',
		icon: MessageSquare
	},
	{
		title: 'Favorites and progress',
		description: 'Save favorite episodes and pick up right where you left off.',
		icon: Heart
	},
	{
		title: 'Trivia',
		description: 'Test how well you really know Dunder Mifflin.',
		icon: Lightbulb
	},
	{
		title: 'Episode guide',
		description: 'Browse every season and episode, no account needed.',
		icon: BookOpen
	}
];
