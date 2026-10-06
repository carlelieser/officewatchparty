import { describe, expect, it } from 'vitest';
import { addDays, daysBetween, isDateKey, utcDateKey } from '$lib/features/trivia';

describe('utcDateKey', () => {
	it('uses the UTC calendar day', () => {
		expect(utcDateKey(new Date('2026-10-05T23:30:00-05:00'))).toBe('2026-10-06');
	});
});

describe('isDateKey', () => {
	it('accepts real calendar dates only', () => {
		expect(isDateKey('2026-10-05')).toBe(true);
		expect(isDateKey('2026-02-30')).toBe(false);
		expect(isDateKey('10/05/2026')).toBe(false);
		expect(isDateKey(20261005)).toBe(false);
	});
});

describe('addDays and daysBetween', () => {
	it('cross month boundaries', () => {
		expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
		expect(daysBetween('2026-10-31', '2026-11-02')).toBe(2);
		expect(daysBetween('2026-11-02', '2026-10-31')).toBe(-2);
	});
});
