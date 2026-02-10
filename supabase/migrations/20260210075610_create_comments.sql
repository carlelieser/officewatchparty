create table comments (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) > 0),
  created_at timestamptz not null default now()
);

alter table comments enable row level security;

create policy "Users can view comments in rooms they can access"
  on comments for select
  to authenticated
  using (
    exists (
      select 1 from rooms
      where rooms.id = comments.room_id
        and (
          rooms.owner_id = auth.uid()
          or rooms.access_type = 'link'
          or exists (
            select 1 from room_access
            where room_access.room_id = rooms.id
              and room_access.user_id = auth.uid()
          )
        )
    )
  );

create policy "Users can comment in rooms they can access"
  on comments for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from rooms
      where rooms.id = comments.room_id
        and (
          rooms.owner_id = auth.uid()
          or rooms.access_type = 'link'
          or exists (
            select 1 from room_access
            where room_access.room_id = rooms.id
              and room_access.user_id = auth.uid()
          )
        )
    )
  );

-- Returns comments with user emails
create or replace function get_room_comments(p_room_id uuid)
returns table(id uuid, user_id uuid, email text, content text, created_at timestamptz)
security definer
set search_path = ''
as $$
begin
  return query
    select c.id, c.user_id, u.email::text, c.content, c.created_at
    from public.comments c
    join auth.users u on u.id = c.user_id
    where c.room_id = p_room_id
    order by c.created_at asc;
end;
$$ language plpgsql;
