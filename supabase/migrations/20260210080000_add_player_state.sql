alter table rooms add column is_playing boolean not null default false;
alter table rooms add column player_time float not null default 0;
alter table rooms add column player_updated_at timestamptz not null default now();
