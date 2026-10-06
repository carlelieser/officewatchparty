-- One answer per user per trivia day. Correctness is not stored: the server
-- grades against the question bank so clients cannot write their own score.
create table trivia_answers (
  user_id uuid not null references auth.users(id) on delete cascade,
  trivia_date date not null,
  question_id text not null,
  selected_index smallint not null check (selected_index between 0 and 3),
  answered_at timestamptz not null default now(),
  primary key (user_id, trivia_date)
);

alter table trivia_answers enable row level security;

create policy "Users can view their own trivia answers"
  on trivia_answers for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Answers are final (no update/delete policies) and cannot be recorded for
-- days that have not started yet in UTC.
create policy "Users can record their own trivia answers"
  on trivia_answers for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and trivia_date <= (now() at time zone 'utc')::date
  );
