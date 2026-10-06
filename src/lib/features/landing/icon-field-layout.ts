import type { Component } from 'svelte';
import type { IconFieldCell, PointerPosition } from './types';

export function buildIconFieldCells(
	width: number,
	height: number,
	cellSize: number,
	icons: Array<Component>
): Array<IconFieldCell> {
	const columns = Math.ceil(width / cellSize) + 1;
	const rows = Math.ceil(height / cellSize) + 1;
	const cells: Array<IconFieldCell> = [];

	for (let row = 0; row < rows; row += 1) {
		for (let column = 0; column < columns; column += 1) {
			const index = row * columns + column;
			const isOffsetRow = row % 2 === 1;
			const columnShift = isOffsetRow ? cellSize / 2 : 0;
			cells.push({
				id: `${row}-${column}`,
				x: column * cellSize + columnShift,
				y: row * cellSize + cellSize / 2,
				icon: icons[index % icons.length]
			});
		}
	}

	return cells;
}

export function proximityTo(
	cell: IconFieldCell,
	pointer: PointerPosition | null,
	radius: number
): number {
	if (pointer === null) return 0;
	const distance = Math.hypot(cell.x - pointer.x, cell.y - pointer.y);
	const linear = Math.max(0, 1 - distance / radius);
	return linear * linear;
}
