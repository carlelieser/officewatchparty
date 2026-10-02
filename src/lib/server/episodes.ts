import data from '$lib/server/data.json';
import type { Episode, Season } from '$lib/features/episodes/types';
import type { Favorite } from '$lib/features/favorites/types';

export class Episodes {
	static readonly all = data as Array<Episode>;

	static find(season: number, episode: number): Episode | null {
		return this.all.find((candidate) => candidate.season === season && candidate.episode === episode) ?? null;
	}

	static bySeason(): Array<Season> {
		const grouped = new Map<number, Array<Episode>>();

		for (const episode of this.all) {
			const existing = grouped.get(episode.season) ?? [];
			existing.push(episode);
			grouped.set(episode.season, existing);
		}

		const seasons: Array<Season> = [];
		for (const [season, episodes] of grouped) {
			const ordered = [...episodes].sort((first, second) => first.episode - second.episode);
			seasons.push({ season, episodes: ordered });
		}

		return seasons.sort((first, second) => first.season - second.season);
	}

	static forSeason(season: number): Array<Episode> {
		return this.all
			.filter((candidate) => candidate.season === season)
			.sort((first, second) => first.episode - second.episode);
	}

	static fromFavorites(favorites: Array<Favorite>): Array<Episode> {
		return favorites
			.map((favorite) => this.find(favorite.season, favorite.episode))
			.filter((episode): episode is Episode => episode !== null);
	}
}
