import { toast } from 'svelte-sonner';
import { shouldShowDonationPrompt } from './should-show-prompt';
import { recordDismissal, recordDonation, recordEpisodeWatched } from './api';
import DonationToastContent from './components/donation-toast-content.svelte';
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

	function handleAlreadyDonated(): void {
		dismissToast();
		state = { ...state, donated_at: new Date().toISOString() };
		recordDonation();
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

		toastId = toast.custom(DonationToastContent, {
			duration: Infinity,
			componentProps: {
				onSupport: handleSupport,
				onDismiss: handleDismiss,
				onAlreadyDonated: handleAlreadyDonated
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
