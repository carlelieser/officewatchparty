import type { JsonLdObject } from './types';

/**
 * Serializes structured data for an inline `<script type="application/ld+json">`.
 * Escaping `<` keeps a value like `</script>` from closing the tag early.
 */
export function serializeJsonLd(document: JsonLdObject): string {
	const json = JSON.stringify(document);
	return json.replaceAll('<', '\\u003c');
}

export function jsonLdScript(document: JsonLdObject): string {
	const serialized = serializeJsonLd(document);
	return `<script type="application/ld+json">${serialized}</script>`;
}
