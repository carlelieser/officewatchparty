import type { Component } from 'svelte';
import type { Episode } from '$lib/features/episodes/types';

export type MessageText = () => string;

export type LandingFeature = {
	title: MessageText;
	description: MessageText;
	icon: Component;
};

export type HowItWorksStep = {
	title: MessageText;
	description: MessageText;
	icon: Component;
};

export type EpisodeFinder = (season: number, episode: number) => Episode | null;

export type MockViewer = {
	name: string;
	initials: string;
};

export type MockReaction = {
	emoji: string;
	delaySeconds: number;
	leftPercent: number;
};

export type MockPlayback = {
	elapsedLabel: string;
	durationLabel: string;
	progressPercent: number;
};

export type PointerPosition = {
	x: number;
	y: number;
};

export type IconFieldCell = {
	id: string;
	x: number;
	y: number;
	icon: Component;
};
