import { SvelteSet } from 'svelte/reactivity';
import type { HomeSectionKey } from './home-section-keys';
import type { SaveSectionVisibility, SaveVisibilityOutcome } from './types';

export class SectionVisibility {
	#hidden: SvelteSet<HomeSectionKey>;
	#pending = new SvelteSet<HomeSectionKey>();
	#save: SaveSectionVisibility;

	constructor(initialHidden: Array<HomeSectionKey>, save: SaveSectionVisibility) {
		this.#hidden = new SvelteSet(initialHidden);
		this.#save = save;
	}

	isHidden(section: HomeSectionKey): boolean {
		return this.#hidden.has(section);
	}

	isPending(section: HomeSectionKey): boolean {
		return this.#pending.has(section);
	}

	async setHidden(section: HomeSectionKey, isHidden: boolean): Promise<SaveVisibilityOutcome> {
		this.#pending.add(section);
		this.#apply(section, isHidden);

		const outcome = await this.#save(section, isHidden);
		this.#pending.delete(section);
		if (outcome.kind === 'failed') this.#apply(section, !isHidden);

		return outcome;
	}

	#apply(section: HomeSectionKey, isHidden: boolean): void {
		if (isHidden) this.#hidden.add(section);
		else this.#hidden.delete(section);
	}
}
