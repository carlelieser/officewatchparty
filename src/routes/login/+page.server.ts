import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (user) redirect(303, '/');
};

function getEmail(formData: FormData) {
	const email = formData.get('email') as string;
	if (!email) throw fail(400, { error: 'Email is required', email });
	return email;
}

export const actions: Actions = {
	sendOtp: async ({ request, locals: { supabase } }) => {
		const email = getEmail(await request.formData());

		const { error } = await supabase.auth.signInWithOtp({ email });
		if (error) return fail(500, { error: error.message, email });

		return { otpSent: true, email };
	},

	verifyOtp: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = getEmail(formData);
		const token = formData.get('token') as string;

		if (!token) return fail(400, { error: 'Code is required', email });

		const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
		if (error) return fail(400, { error: error.message, email });

		redirect(303, '/');
	}
};
