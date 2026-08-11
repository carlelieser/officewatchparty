import { toast } from 'svelte-sonner';
import { HeartIcon } from '@lucide/svelte';
import { shouldShowDonationPrompt } from './should-show-prompt';
import { recordDismissal, recordEpisodeWatched } from './api';
import type { DonationPromptState } from './types';

export type DonationPromptControllerOptions = {
	getInitialState: () => DonationPromptState;
	getIsOwner: () => boolean;
	supportUrl: string;
};

export type DonationPromptController = {
	episodeWatched: () => Promise<void>;
	destroy: () => void;
};

export function createDonationPromptController(
	options: DonationPromptControllerOptions
): DonationPromptController {
	const { getInitialState, getIsOwner, supportUrl } = options;

	let state: DonationPromptState = getInitialState();
	let episodesThisSession = 0;
	let shownThisSession = false;
	let toastId: string | number | undefined;

	function dismissToast(): void {
		if (toastId !== undefined) {
			toast.dismiss(toastId);
			toastId = undefined;
		}
	}

	function handleSupport(): void {
		dismissToast();
		window.open(supportUrl, '_blank', 'noopener,noreferrer');
	}

	function handleDismiss(): void {
		dismissToast();
		state = {
			...state,
			dismissed_count: state.dismissed_count + 1,
			last_dismissed_at: new Date().toISOString()
		};
		recordDismissal();
	}

	async function episodeWatched(): Promise<void> {
		episodesThisSession = episodesThisSession + 1;

		const updated = await recordEpisodeWatched();
		if (updated) state = updated;

		const decision = shouldShowDonationPrompt({
			state,
			isOwner: getIsOwner(),
			episodesThisSession,
			shownThisSession,
			now: new Date()
		});

		if (!decision.shouldShow) return;

		shownThisSession = true;

		toastId = toast('Enjoying the party?', {
			description: 'Help keep the project alive by showing your support.',
			icon: HeartIcon,
			duration: Infinity,
			action: {
				label: 'Support',
				onClick: handleSupport
			},
			cancel: {
				label: 'Not now',
				onClick: handleDismiss
			}
		});
	}

	return {
		episodeWatched,

		destroy(): void {
			dismissToast();
		}
	};
}
