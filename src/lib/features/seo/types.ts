export type OpenGraphType = 'website' | 'video.episode';

export type SeoMeta = {
	title: string;
	description: string;
	path: string;
	image?: string;
	type?: OpenGraphType;
	isHiddenFromSearch?: boolean;
};

export type JsonLdValue = string | number | boolean | null | JsonLdObject | Array<JsonLdValue>;

export type JsonLdObject = {
	[key: string]: JsonLdValue;
};
