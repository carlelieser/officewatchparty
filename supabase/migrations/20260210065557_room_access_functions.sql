-- Returns members of a room with their emails (owner-only)
create or replace function get_room_members(p_room_id uuid)
returns table(user_id uuid, email text, created_at timestamptz)
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.rooms where id = p_room_id and owner_id = auth.uid()
  ) then
    raise exception 'Not authorized';
  end if;

  return query
    select ra.user_id, u.email::text, ra.created_at
    from public.room_access ra
    join auth.users u on u.id = ra.user_id
    where ra.room_id = p_room_id;
end;
$$ language plpgsql;

-- Grants room access by email (owner-only)
create or replace function grant_room_access(p_room_id uuid, p_email text)
returns void
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
begin
  if not exists (
    select 1 from public.rooms where id = p_room_id and owner_id = auth.uid()
  ) then
    raise exception 'Not authorized';
  end if;

  select id into v_user_id from auth.users where lower(email) = lower(p_email);

  if v_user_id is null then
    raise exception 'User not found';
  end if;

  insert into public.room_access (room_id, user_id) values (p_room_id, v_user_id)
  on conflict do nothing;
end;
$$ language plpgsql;
