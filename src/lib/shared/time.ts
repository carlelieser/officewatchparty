export function timeAgo(date: string): string {
	const nowTimestamp = Date.now();
	const dateTimestamp = new Date(date).getTime();
	const elapsedSeconds = Math.floor((nowTimestamp - dateTimestamp) / 1000);

	if (elapsedSeconds < 60) return 'just now';

	const elapsedMinutes = Math.floor(elapsedSeconds / 60);
	if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;

	const elapsedHours = Math.floor(elapsedMinutes / 60);
	if (elapsedHours < 24) return `${elapsedHours}h ago`;

	const elapsedDays = Math.floor(elapsedHours / 24);
	return `${elapsedDays}d ago`;
}
