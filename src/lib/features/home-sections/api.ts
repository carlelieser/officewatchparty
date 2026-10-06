import type { HomeSectionKey } from './home-section-keys';
import type { SaveVisibilityOutcome, SectionVisibilityRequest } from './types';

export async function saveSectionVisibility(
	section: HomeSectionKey,
	isHidden: boolean
): Promise<SaveVisibilityOutcome> {
	const payload: SectionVisibilityRequest = { section };

	try {
		const response = await fetch('/api/home-sections/hidden', {
			method: isHidden ? 'POST' : 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		return response.ok ? { kind: 'saved' } : { kind: 'failed' };
	} catch {
		return { kind: 'failed' };
	}
}
