create table donation_prompts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  episodes_completed integer not null default 0,
  dismissed_count integer not null default 0,
  last_dismissed_at timestamptz,
  donated_at timestamptz,
  created_at timestamptz not null default now()
);

alter table donation_prompts enable row level security;

create policy "Users can view their own donation prompt state"
  on donation_prompts for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert their own donation prompt state"
  on donation_prompts for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own donation prompt state"
  on donation_prompts for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
