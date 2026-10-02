import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	return { ...data, chrome: 'sidebar' as const };
};
