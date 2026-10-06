import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	LOGIN_ERROR_PARAM,
	REDIRECT_PARAM,
	buildOAuthCallbackUrl,
	parseLoginError,
	safeRedirectTarget,
	type LoginErrorCode
} from '$lib/features/auth';

type OtpSentResult = {
	otpSent: true;
	email: string;
};

type OtpErrorResult = {
	error: string;
	email: string;
};

type LoginErrorResult = {
	loginError: LoginErrorCode;
};

type LoginPageData = {
	loginError: LoginErrorCode | null;
};

function getEmail(formData: FormData): string {
	const email = formData.get('email');
	if (typeof email !== 'string' || !email)
		throw fail(400, { error: 'Email is required', email: '' });
	return email;
}

export const load: PageServerLoad = async ({
	url,
	locals: { safeGetSession }
}): Promise<LoginPageData> => {
	const { user } = await safeGetSession();
	if (!user) return { loginError: parseLoginError(url.searchParams.get(LOGIN_ERROR_PARAM)) };

	const target = safeRedirectTarget(url.searchParams.get(REDIRECT_PARAM));
	redirect(303, target);
};

export const actions: Actions = {
	sendOtp: async ({ request, locals: { supabase } }) => {
		const email = getEmail(await request.formData());

		const { error } = await supabase.auth.signInWithOtp({ email });
		if (error) return fail(500, { error: error.message, email } satisfies OtpErrorResult);

		return { otpSent: true, email } satisfies OtpSentResult;
	},

	verifyOtp: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = getEmail(formData);
		const token = formData.get('token');

		if (typeof token !== 'string' || !token)
			return fail(400, { error: 'Code is required', email } satisfies OtpErrorResult);

		const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
		if (error) return fail(400, { error: error.message, email } satisfies OtpErrorResult);

		const target = safeRedirectTarget(formData.get(REDIRECT_PARAM));
		redirect(303, target);
	},

	signInWithGoogle: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const target = safeRedirectTarget(formData.get(REDIRECT_PARAM));
		const callbackUrl = buildOAuthCallbackUrl(url.origin, target);

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: callbackUrl }
		});
		if (error) return fail(500, { loginError: 'oauth_failed' } satisfies LoginErrorResult);

		redirect(303, data.url);
	}
};
