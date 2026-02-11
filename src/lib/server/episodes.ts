import data from '$lib/server/data.json';
import type { Episode, Favorite } from '$lib/types';

export class Episodes {
	static readonly all = data as Array<Episode>;

	static find(season: number, episode: number): Episode {
		return (
			this.all.find((e) => e.season === season && e.episode === episode) ?? {
				season,
				episode,
				label: `S${season}E${episode}`,
				description: ''
			}
		);
	}

	static fromFavorites(favorites: Favorite[]): Episode[] {
		return favorites.map((f) => this.find(f.season, f.episode));
	}
}
