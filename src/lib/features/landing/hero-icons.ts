import {
	Briefcase,
	Calculator,
	Clipboard,
	Coffee,
	FileText,
	Folder,
	LampDesk,
	Mail,
	Notebook,
	Paperclip,
	Pen,
	Pencil,
	Phone,
	Printer,
	Ruler,
	Scissors,
	StickyNote
} from '@lucide/svelte';
import type { Component } from 'svelte';

export const HERO_ICONS: Array<Component> = [
	Pen,
	Clipboard,
	Printer,
	Paperclip,
	Coffee,
	Phone,
	StickyNote,
	Calculator,
	Folder,
	Pencil,
	FileText,
	Scissors,
	Briefcase,
	Ruler,
	Mail,
	Notebook,
	LampDesk
];

export const ICON_FIELD_CELL_SIZE = 88;
export const ICON_FIELD_RADIUS = 280;
