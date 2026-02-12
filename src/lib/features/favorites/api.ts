export async function addFavorite(season: number, episode: number): Promise<void> {
	await fetch('/api/favorites', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ season, episode })
	});
}

export async function removeFavorite(season: number, episode: number): Promise<void> {
	await fetch('/api/favorites', {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ season, episode })
	});
}
