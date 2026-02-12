export async function postComment(roomAlias: string, content: string): Promise<void> {
	await fetch(`/api/rooms/${roomAlias}/comments`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ content })
	});
}
