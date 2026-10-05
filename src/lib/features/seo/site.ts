export const SITE_ORIGIN = 'https://officewatchparty.com';

export const SITE_NAME = 'OfficeWatchParty';

export const DEFAULT_IMAGE_PATH = '/og.png';

export function absoluteUrl(path: string): string {
	return `${SITE_ORIGIN}${path}`;
}

export function pageTitle(title: string): string {
	return `${title} - ${SITE_NAME}`;
}
