import { json } from '@sveltejs/kit';
import { Episodes } from '$lib/server/episodes';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json(Episodes.all);
};
