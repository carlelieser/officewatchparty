export function padNumber(value: number, length: number = 2): string {
	return String(value).padStart(length, '0');
}

export function formatEpisodeCode(season: number, episode: number): string {
	return `S${padNumber(season)}E${padNumber(episode)}`;
}
