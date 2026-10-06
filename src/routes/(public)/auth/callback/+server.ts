import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { buildLoginErrorUrl, parseOAuthCallback } from '$lib/features/auth';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const callback = parseOAuthCallback(url);
	if (callback.kind === 'error')
		redirect(303, buildLoginErrorUrl(callback.errorCode, callback.target));

	const { error } = await supabase.auth.exchangeCodeForSession(callback.code);
	if (error) redirect(303, buildLoginErrorUrl('oauth_failed', callback.target));

	redirect(303, callback.target);
};
