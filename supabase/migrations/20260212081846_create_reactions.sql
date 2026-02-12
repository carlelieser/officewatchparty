create table reactions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null check (char_length(emoji) > 0),
  created_at timestamptz not null default now(),
  unique (room_id, user_id, emoji)
);

alter table reactions enable row level security;

create policy "Users can view reactions in rooms they can access"
  on reactions for select
  to authenticated
  using (
    exists (
      select 1 from rooms
      where rooms.id = reactions.room_id
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

create policy "Users can add reactions in rooms they can access"
  on reactions for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from rooms
      where rooms.id = reactions.room_id
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

create policy "Users can remove their own reactions"
  on reactions for delete
  to authenticated
  using (user_id = auth.uid());

-- Returns emoji counts for a room
create or replace function get_room_reaction_counts(p_room_id uuid)
returns table(emoji text, count bigint)
security definer
set search_path = ''
as $$
begin
  return query
    select r.emoji, count(*)::bigint
    from public.reactions r
    where r.room_id = p_room_id
    group by r.emoji
    order by count(*) desc;
end;
$$ language plpgsql;

-- Returns emojis the current user has reacted with in a room
create or replace function get_user_reactions(p_room_id uuid)
returns table(emoji text)
security definer
set search_path = ''
as $$
begin
  return query
    select r.emoji
    from public.reactions r
    where r.room_id = p_room_id
      and r.user_id = auth.uid();
end;
$$ language plpgsql;
