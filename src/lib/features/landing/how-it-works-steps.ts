import { DoorOpen, Play, UserPlus } from '@lucide/svelte';
import { m } from '$lib/paraglide/messages';
import type { HowItWorksStep } from './types';

export const HOW_IT_WORKS_STEPS: Array<HowItWorksStep> = [
	{
		title: m.landing_step_create_room_title,
		description: m.landing_step_create_room_description,
		icon: DoorOpen
	},
	{
		title: m.landing_step_invite_title,
		description: m.landing_step_invite_description,
		icon: UserPlus
	},
	{
		title: m.landing_step_play_title,
		description: m.landing_step_play_description,
		icon: Play
	}
];
