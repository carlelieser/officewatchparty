create policy "Owners can delete their rooms"
  on rooms for delete
  to authenticated
  using (owner_id = auth.uid());
