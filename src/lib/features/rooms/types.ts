export type Room = {
	id: string;
	alias: string;
	owner_id: string;
	season: number | null;
	episode: number | null;
	is_playing: boolean;
	player_time: number;
	player_updated_at: string | null;
	access_type: 'invite_only' | 'link';
};

export type Member = {
	user_id: string;
	email: string;
	created_at: string;
};

export type OwnedRoom = {
	alias: string;
	season: number;
	episode: number;
	label: string;
	guests: number;
};
