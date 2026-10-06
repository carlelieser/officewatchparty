import { Heart, Lightbulb, MessageSquare, PartyPopper, SmilePlus, BookOpen } from '@lucide/svelte';
import { m } from '$lib/paraglide/messages';
import type { LandingFeature } from './types';

export const LANDING_FEATURES: Array<LandingFeature> = [
	{
		title: m.landing_feature_sync_title,
		description: m.landing_feature_sync_description,
		icon: PartyPopper
	},
	{
		title: m.landing_feature_reactions_title,
		description: m.landing_feature_reactions_description,
		icon: SmilePlus
	},
	{
		title: m.landing_feature_comments_title,
		description: m.landing_feature_comments_description,
		icon: MessageSquare
	},
	{
		title: m.landing_feature_favorites_title,
		description: m.landing_feature_favorites_description,
		icon: Heart
	},
	{
		title: m.landing_feature_trivia_title,
		description: m.landing_feature_trivia_description,
		icon: Lightbulb
	},
	{
		title: m.landing_feature_guide_title,
		description: m.landing_feature_guide_description,
		icon: BookOpen
	}
];
