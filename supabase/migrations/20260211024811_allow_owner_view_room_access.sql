create policy "Owners can view access entries for their rooms"
  on room_access for select
  to authenticated
  using (
    exists (
      select 1 from rooms
      where rooms.id = room_access.room_id
        and rooms.owner_id = auth.uid()
    )
  );
