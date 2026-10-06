import { resolve } from '$app/paths';
import type { ResumePoint } from '$lib/features/episodes/types';

export function watchHref(resume: ResumePoint): string {
	const episodeQuery = `season=${resume.season}&episode=${resume.episode}`;
	const timeQuery = resume.timeSeconds > 0 ? `&t=${resume.timeSeconds}` : '';
	return `${resolve('/watch')}?${episodeQuery}${timeQuery}`;
}
