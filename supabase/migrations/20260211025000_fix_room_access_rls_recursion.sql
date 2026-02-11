-- Fix infinite recursion: room_access SELECT policy queries rooms,
-- whose SELECT policy queries room_access, creating a cycle.
-- Solution: a security definer function that bypasses RLS.

create or replace function is_room_owner(p_room_id uuid)
returns boolean
security definer
set search_path = ''
as $$
begin
  return exists (
    select 1 from public.rooms
    where id = p_room_id
      and owner_id = auth.uid()
  );
end;
$$ language plpgsql;

-- Replace the owner SELECT policy that caused the recursion
drop policy "Owners can view access entries for their rooms" on room_access;

create policy "Owners can view access entries for their rooms"
  on room_access for select
  to authenticated
  using (is_room_owner(room_id));

-- Also fix INSERT/DELETE policies — they hit the same cycle now
-- that room_access has a SELECT policy referencing rooms.
drop policy "Room owners can grant access" on room_access;

create policy "Room owners can grant access"
  on room_access for insert
  to authenticated
  with check (is_room_owner(room_id));

drop policy "Room owners can revoke access" on room_access;

create policy "Room owners can revoke access"
  on room_access for delete
  to authenticated
  using (is_room_owner(room_id));
