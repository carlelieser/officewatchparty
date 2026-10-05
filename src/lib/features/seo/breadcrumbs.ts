import { absoluteUrl } from './site';
import type { JsonLdObject } from './types';
import type { ResolvedPathname } from '$app/types';

export type Breadcrumb = {
	name: string;
	// Already passed through `resolve()`, so it doubles as the link href.
	path: ResolvedPathname;
};

function toListItem(breadcrumb: Breadcrumb, index: number): JsonLdObject {
	return {
		'@type': 'ListItem',
		position: index + 1,
		name: breadcrumb.name,
		item: absoluteUrl(breadcrumb.path)
	};
}

export function breadcrumbSchema(breadcrumbs: Array<Breadcrumb>): JsonLdObject {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: breadcrumbs.map(toListItem)
	};
}
