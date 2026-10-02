export function padNumber(value: number, length: number = 2): string {
	return String(value).padStart(length, '0');
}

export function formatEpisodeCode(season: number, episode: number): string {
	return `S${padNumber(season)}E${padNumber(episode)}`;
}

export function formatSeasonEpisode(season: number, episode: number): string {
	return `Season ${season} · Episode ${episode}`;
}

export function episodeThumbnailUrl(season: number, episode: number): string {
	const seasonSegment = `S${padNumber(season)}`;
	const fileName = `${formatEpisodeCode(season, episode)}.jpg`;
	return `/thumb/${seasonSegment}/${fileName}`;
}
