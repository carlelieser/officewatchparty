import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isHomeSectionKey, type HomeSectionKey } from '$lib/features/home-sections';

type VisibilityBody = {
	section?: unknown;
};

async function readSection(request: Request): Promise<HomeSectionKey> {
	const body: VisibilityBody = await request.json().catch(function rejectMalformedJson(): never {
		error(400, 'Request body must be JSON');
	});

	if (!isHomeSectionKey(body.section)) error(400, 'section must be a known home section');
	return body.section;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const section = await readSection(request);
	await locals.repos.hiddenHomeSections.hide(locals.user.id, section);
	return new Response(null, { status: 204 });
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const section = await readSection(request);
	await locals.repos.hiddenHomeSections.show(locals.user.id, section);
	return new Response(null, { status: 204 });
};
