export type ReactionCount = {
	emoji: string;
	count: number;
};

export type ReactionBroadcast = {
	emoji: string;
	action: 'add' | 'remove';
};
