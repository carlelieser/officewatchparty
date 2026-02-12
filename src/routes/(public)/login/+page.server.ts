import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

type OtpSentResult = {
	otpSent: true;
	email: string;
};

type OtpErrorResult = {
	error: string;
	email: string;
};

function getEmail(formData: FormData): string {
	const email = formData.get('email');
	if (typeof email !== 'string' || !email) throw fail(400, { error: 'Email is required', email: '' });
	return email;
}

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (user) redirect(303, '/');
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

		if (typeof token !== 'string' || !token) return fail(400, { error: 'Code is required', email } satisfies OtpErrorResult);

		const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
		if (error) return fail(400, { error: error.message, email } satisfies OtpErrorResult);

		redirect(303, '/');
	}
};
