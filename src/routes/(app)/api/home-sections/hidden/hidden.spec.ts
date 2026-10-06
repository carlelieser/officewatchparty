import { describe, expect, it } from 'vitest';
import { DELETE, POST } from './+server';
import type { HomeSectionKey } from '$lib/features/home-sections';
import type { HiddenHomeSectionsRepo } from '$lib/server/repos/hidden-home-sections';

type VisibilityEvent = Parameters<typeof POST>[0];

const USER_ID = 'user-1';

function createFakeRepo(hidden: Set<HomeSectionKey>): HiddenHomeSectionsRepo {
	return {
		async findByUserId(): Promise<Array<HomeSectionKey>> {
			return [...hidden];
		},
		async hide(_userId: string, section: HomeSectionKey): Promise<void> {
			hidden.add(section);
		},
		async show(_userId: string, section: HomeSectionKey): Promise<void> {
			hidden.delete(section);
		}
	};
}

function createEvent(body: string, repo: HiddenHomeSectionsRepo): VisibilityEvent {
	const request = new Request('http://localhost/api/home-sections/hidden', {
		method: 'POST',
		body
	});
	const locals = { user: { id: USER_ID }, repos: { hiddenHomeSections: repo } };
	return { request, locals } as unknown as VisibilityEvent;
}

describe('/api/home-sections/hidden', () => {
	it('hides a section', async () => {
		const hidden = new Set<HomeSectionKey>();
		const response = await POST(createEvent('{"section":"favorites"}', createFakeRepo(hidden)));

		expect(response.status).toBe(204);
		expect([...hidden]).toEqual(['favorites']);
	});

	it('shows a hidden section again', async () => {
		const hidden = new Set<HomeSectionKey>(['rooms']);
		const response = await DELETE(createEvent('{"section":"rooms"}', createFakeRepo(hidden)));

		expect(response.status).toBe(204);
		expect(hidden.size).toBe(0);
	});

	it.each([
		['an unknown section', '{"section":"settings"}'],
		['a missing section', '{}'],
		['malformed JSON', '{']
	])('rejects %s', async (_label, body) => {
		await expect(POST(createEvent(body, createFakeRepo(new Set())))).rejects.toMatchObject({
			status: 400
		});
	});
});
