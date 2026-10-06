export const HOME_SECTION_KEYS = [
	'daily-trivia',
	'continue-watching',
	'favorites',
	'rooms'
] as const;

export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

export function isHomeSectionKey(value: unknown): value is HomeSectionKey {
	return HOME_SECTION_KEYS.some((key) => key === value);
}
