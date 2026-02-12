export async function deleteRoom(alias: string): Promise<void> {
	await fetch(`/api/rooms/${alias}`, { method: 'DELETE' });
}

export async function updateAccessType(alias: string, accessType: 'invite_only' | 'link'): Promise<void> {
	await fetch(`/api/rooms/${alias}/access-type`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ access_type: accessType })
	});
}

export async function addMember(alias: string, email: string): Promise<void> {
	await fetch(`/api/rooms/${alias}/members`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email })
	});
}

export async function removeMember(alias: string, userId: string): Promise<void> {
	await fetch(`/api/rooms/${alias}/members`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ user_id: userId })
	});
}

export async function updateEpisode(alias: string, season: number, episode: number): Promise<void> {
	await fetch(`/api/rooms/${alias}/episode`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ season, episode })
	});
}

export async function updatePlayerState(alias: string, isPlaying: boolean, playerTime: number): Promise<void> {
	await fetch(`/api/rooms/${alias}/player`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ is_playing: isPlaying, player_time: playerTime })
	});
}
