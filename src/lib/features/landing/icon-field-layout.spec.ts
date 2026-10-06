import { describe, expect, it } from 'vitest';
import { Pen, Printer } from '@lucide/svelte';
import { buildIconFieldCells, proximityTo } from './icon-field-layout';
import type { IconFieldCell } from './types';

const ORIGIN_CELL: IconFieldCell = { id: '0-0', x: 0, y: 0, icon: Pen };

describe('buildIconFieldCells', () => {
	it('covers the area with one extra column and row and cycles the icons', () => {
		const cells = buildIconFieldCells(200, 100, 100, [Pen, Printer]);
		expect(cells).toHaveLength(6);
		expect(cells.map((cell) => cell.icon)).toEqual([Pen, Printer, Pen, Printer, Pen, Printer]);
	});

	it('shifts every other row by half a cell', () => {
		const cells = buildIconFieldCells(100, 200, 100, [Pen]);
		const firstRow = cells.find((cell) => cell.id === '0-0');
		const secondRow = cells.find((cell) => cell.id === '1-0');
		expect(firstRow?.x).toBe(0);
		expect(secondRow?.x).toBe(50);
	});
});

describe('proximityTo', () => {
	it('is zero without a pointer or beyond the radius', () => {
		expect(proximityTo(ORIGIN_CELL, null, 100)).toBe(0);
		expect(proximityTo(ORIGIN_CELL, { x: 150, y: 0 }, 100)).toBe(0);
	});

	it('is one at the pointer and eases toward the edge', () => {
		expect(proximityTo(ORIGIN_CELL, { x: 0, y: 0 }, 100)).toBe(1);
		expect(proximityTo(ORIGIN_CELL, { x: 50, y: 0 }, 100)).toBe(0.25);
	});
});
