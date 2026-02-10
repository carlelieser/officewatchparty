import { createBrowserClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
	depends('supabase:auth');

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: { fetch },
		isSingleton: true
	});

	if (isBrowser()) {
		const {
			data: { session }
		} = await supabase.auth.getSession();
		return { ...data, supabase, session };
	}

	return { ...data, supabase, session: data.session };
};
