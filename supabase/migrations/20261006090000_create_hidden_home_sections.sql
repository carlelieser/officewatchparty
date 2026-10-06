-- Home page sections each user has chosen to hide.
create table hidden_home_sections (
  user_id uuid not null references auth.users(id) on delete cascade,
  section text not null check (
    section in ('daily-trivia', 'continue-watching', 'favorites', 'rooms')
  ),
  hidden_at timestamptz not null default now(),
  primary key (user_id, section)
);

alter table hidden_home_sections enable row level security;

create policy "Users can view their own hidden home sections"
  on hidden_home_sections for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can hide their own home sections"
  on hidden_home_sections for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users can show their own home sections"
  on hidden_home_sections for delete
  to authenticated
  using (user_id = (select auth.uid()));
