-- Public per-episode comments and reactions for the /watch page.
-- Unlike room comments/reactions these are not tied to a room: they are keyed by
-- (season, episode) and are readable by any authenticated user, so everyone
-- watching the same episode shares one comment thread and reaction set.

-- ---------------------------------------------------------------------------
-- episode_comments
-- ---------------------------------------------------------------------------
create table episode_comments (
  id uuid primary key default gen_random_uuid(),
  season smallint not null,
  episode smallint not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) > 0),
  created_at timestamptz not null default now()
);

alter table episode_comments enable row level security;

-- Any authenticated user can read the shared thread for an episode.
create policy "Anyone can view episode comments"
  on episode_comments for select
  to authenticated
  using (true);

-- Users may only post as themselves.
create policy "Users can add their own episode comments"
  on episode_comments for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- Users may only remove their own comments.
create policy "Users can remove their own episode comments"
  on episode_comments for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- Fetch the shared thread ordered oldest-first. SECURITY DEFINER so it can join
-- auth.users for the author email, which clients cannot read directly.
create or replace function get_episode_comments(p_season integer, p_episode integer)
returns table(id uuid, user_id uuid, email text, content text, created_at timestamptz)
security definer
set search_path = ''
as $$
begin
  return query
    select c.id, c.user_id, u.email::text, c.content, c.created_at
    from public.episode_comments c
    join auth.users u on u.id = c.user_id
    where c.season = p_season
      and c.episode = p_episode
    order by c.created_at asc;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- episode_reactions
-- ---------------------------------------------------------------------------
create table episode_reactions (
  id uuid primary key default gen_random_uuid(),
  season smallint not null,
  episode smallint not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null check (char_length(emoji) > 0),
  created_at timestamptz not null default now(),
  unique (season, episode, user_id, emoji)
);

alter table episode_reactions enable row level security;

create policy "Anyone can view episode reactions"
  on episode_reactions for select
  to authenticated
  using (true);

create policy "Users can add their own episode reactions"
  on episode_reactions for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users can remove their own episode reactions"
  on episode_reactions for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- Emoji counts for an episode, most used first.
create or replace function get_episode_reaction_counts(p_season integer, p_episode integer)
returns table(emoji text, count bigint)
security definer
set search_path = ''
as $$
begin
  return query
    select r.emoji, count(*)::bigint
    from public.episode_reactions r
    where r.season = p_season
      and r.episode = p_episode
    group by r.emoji
    order by count(*) desc;
end;
$$ language plpgsql;

-- Emojis the current user has reacted with for an episode.
create or replace function get_user_episode_reactions(p_season integer, p_episode integer)
returns table(emoji text)
security definer
set search_path = ''
as $$
begin
  return query
    select r.emoji
    from public.episode_reactions r
    where r.season = p_season
      and r.episode = p_episode
      and r.user_id = (select auth.uid());
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- Indexes: the hot lookup is by (season, episode); user_id is a FK used by the
-- on-delete cascade and owner-scoped policies.
-- ---------------------------------------------------------------------------
create index episode_comments_season_episode_idx on episode_comments (season, episode);
create index episode_comments_user_id_idx on episode_comments (user_id);
create index episode_reactions_season_episode_idx on episode_reactions (season, episode);
create index episode_reactions_user_id_idx on episode_reactions (user_id);
