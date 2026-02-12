export function emailInitials(email: string): string {
	return email.split('@')[0].slice(0, 2).toUpperCase();
}

export function emailUsername(email: string): string {
	return email.split('@')[0];
}
