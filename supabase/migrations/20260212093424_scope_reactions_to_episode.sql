-- Add episode columns to reactions
alter table reactions add column season integer not null default 1;
alter table reactions add column episode integer not null default 1;

-- Drop old unique constraint and add new one scoped to episode
alter table reactions drop constraint reactions_room_id_user_id_emoji_key;
alter table reactions add constraint reactions_room_id_season_episode_user_id_emoji_key
  unique (room_id, season, episode, user_id, emoji);

-- Remove defaults now that the column exists
alter table reactions alter column season drop default;
alter table reactions alter column episode drop default;

-- Update RPC to filter by episode
create or replace function get_room_reaction_counts(p_room_id uuid, p_season integer, p_episode integer)
returns table(emoji text, count bigint)
security definer
set search_path = ''
as $$
begin
  return query
    select r.emoji, count(*)::bigint
    from public.reactions r
    where r.room_id = p_room_id
      and r.season = p_season
      and r.episode = p_episode
    group by r.emoji
    order by count(*) desc;
end;
$$ language plpgsql;

-- Update RPC to filter by episode
create or replace function get_user_reactions(p_room_id uuid, p_season integer, p_episode integer)
returns table(emoji text)
security definer
set search_path = ''
as $$
begin
  return query
    select r.emoji
    from public.reactions r
    where r.room_id = p_room_id
      and r.season = p_season
      and r.episode = p_episode
      and r.user_id = auth.uid();
end;
$$ language plpgsql;
