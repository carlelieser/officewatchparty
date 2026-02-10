create policy "Owners can update their rooms"
  on rooms for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
