const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const weekdayMonthDay = new Intl.DateTimeFormat('en-US', {
	weekday: 'short',
	month: 'short',
	day: 'numeric',
	timeZone: 'UTC'
});

function toUtcMilliseconds(dateKey: string): number {
	return Date.parse(`${dateKey}T00:00:00Z`);
}

export function utcDateKey(now: Date): string {
	return now.toISOString().slice(0, 10);
}

export function isDateKey(value: unknown): value is string {
	if (typeof value !== 'string') return false;
	if (!DATE_KEY_PATTERN.test(value)) return false;

	const milliseconds = toUtcMilliseconds(value);
	const isRealDate = !Number.isNaN(milliseconds);
	return isRealDate && utcDateKey(new Date(milliseconds)) === value;
}

export function addDays(dateKey: string, days: number): string {
	const milliseconds = toUtcMilliseconds(dateKey) + days * MILLISECONDS_PER_DAY;
	return utcDateKey(new Date(milliseconds));
}

export function daysBetween(fromKey: string, toKey: string): number {
	const difference = toUtcMilliseconds(toKey) - toUtcMilliseconds(fromKey);
	return Math.round(difference / MILLISECONDS_PER_DAY);
}

export function formatTriviaDate(dateKey: string, todayKey: string): string {
	const daysAgo = daysBetween(dateKey, todayKey);
	if (daysAgo === 0) return 'Today';
	if (daysAgo === 1) return 'Yesterday';
	return weekdayMonthDay.format(new Date(toUtcMilliseconds(dateKey)));
}
