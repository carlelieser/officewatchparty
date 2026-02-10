create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  season smallint not null,
  episode smallint not null,
  created_at timestamptz not null default now(),
  unique (user_id, season, episode)
);

alter table favorites enable row level security;

create policy "Users can view their own favorites"
  on favorites for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert their own favorites"
  on favorites for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can delete their own favorites"
  on favorites for delete
  to authenticated
  using (user_id = auth.uid());
