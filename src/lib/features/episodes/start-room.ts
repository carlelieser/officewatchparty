import { goto } from '$app/navigation';
import type { Episode } from '$lib/features/episodes/types';

/**
 * Default episode action: open the shared public watch page for the episode.
 * This replaces the old behavior of creating a brand-new room on every click.
 */
export async function watchEpisode(episode: Episode): Promise<void> {
	await goto(`/watch?season=${episode.season}&episode=${episode.episode}`);
}

/**
 * Opt-in action (via the episode overflow menu): create the user's own room for
 * the episode and navigate to it.
 */
export async function createRoom(episode: Episode): Promise<void> {
	await goto(`/room/new?season=${episode.season}&episode=${episode.episode}`);
}
