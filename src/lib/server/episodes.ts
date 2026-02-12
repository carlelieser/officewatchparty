import data from '$lib/server/data.json';
import type { Episode } from '$lib/features/episodes/types';
import type { Favorite } from '$lib/features/favorites/types';

export class Episodes {
	static readonly all = data as Array<Episode>;

	static find(season: number, episode: number): Episode | null {
		return this.all.find((candidate) => candidate.season === season && candidate.episode === episode) ?? null;
	}

	static fromFavorites(favorites: Array<Favorite>): Array<Episode> {
		return favorites
			.map((favorite) => this.find(favorite.season, favorite.episode))
			.filter((episode): episode is Episode => episode !== null);
	}
}
