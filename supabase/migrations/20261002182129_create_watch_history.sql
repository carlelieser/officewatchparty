-- Tracks the most recent time each user opened each episode on the watch page,
-- so the app can offer a "continue watching" entry point.
create table watch_history (
  user_id uuid not null references auth.users(id) on delete cascade,
  season smallint not null,
  episode smallint not null,
  last_watched_at timestamptz not null default now(),
  primary key (user_id, season, episode)
);

alter table watch_history enable row level security;

-- Users only ever see and manage their own history.
create policy "Users can view their own watch history"
  on watch_history for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can record their own watch history"
  on watch_history for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users can update their own watch history"
  on watch_history for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Fetch the user's most recently watched episode, for the "continue" link.
create index watch_history_recent_idx on watch_history (user_id, last_watched_at desc);
