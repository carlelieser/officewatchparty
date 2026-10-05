import type { RequestHandler } from './$types';
import { Episodes } from '$lib/server/episodes';
import { absoluteUrl } from '$lib/features/seo';
import { GUIDE_PATH, episodeGuidePath, seasonGuidePath } from '$lib/features/guide';

export const prerender = true;

const STATIC_PATHS: Array<string> = ['/', '/support', '/tos', '/privacy', GUIDE_PATH];

function urlEntry(path: string): string {
	const location = absoluteUrl(path);
	return `<url><loc>${location}</loc></url>`;
}

function sitemapPaths(): Array<string> {
	const seasonPaths = Episodes.bySeason().map((season) => seasonGuidePath(season.season));
	const episodePaths = Episodes.all.map(episodeGuidePath);
	return [...STATIC_PATHS, ...seasonPaths, ...episodePaths];
}

export const GET: RequestHandler = (): Response => {
	const entries = sitemapPaths().map(urlEntry).join('');
	const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
