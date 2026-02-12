export async function addReaction(alias: string, season: number, episode: number, emoji: string): Promise<void> {
	await fetch(`/api/rooms/${alias}/reactions`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ season, episode, emoji })
	});
}

export async function removeReaction(alias: string, season: number, episode: number, emoji: string): Promise<void> {
	await fetch(`/api/rooms/${alias}/reactions`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ season, episode, emoji })
	});
}
