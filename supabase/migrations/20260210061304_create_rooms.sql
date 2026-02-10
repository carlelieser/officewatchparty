-- rooms table
create table rooms (
  id uuid primary key default gen_random_uuid(),
  season smallint not null default 1,
  episode smallint not null default 1,
  owner_id uuid not null references auth.users(id),
  access_type text not null default 'invite_only'
    check (access_type in ('invite_only', 'link')),
  created_at timestamptz not null default now()
);

alter table rooms enable row level security;

-- room_access table
create table room_access (
  room_id uuid not null references rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

alter table room_access enable row level security;

-- RLS policies for rooms

create policy "Authenticated users can create rooms"
  on rooms for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "Users can view rooms they have access to"
  on rooms for select
  to authenticated
  using (
    owner_id = auth.uid()
    or access_type = 'link'
    or exists (
      select 1 from room_access
      where room_access.room_id = rooms.id
        and room_access.user_id = auth.uid()
    )
  );

-- RLS policies for room_access

create policy "Room owners can grant access"
  on room_access for insert
  to authenticated
  with check (
    exists (
      select 1 from rooms
      where rooms.id = room_access.room_id
        and rooms.owner_id = auth.uid()
    )
  );

create policy "Room owners can revoke access"
  on room_access for delete
  to authenticated
  using (
    exists (
      select 1 from rooms
      where rooms.id = room_access.room_id
        and rooms.owner_id = auth.uid()
    )
  );

create policy "Users can view their own access entries"
  on room_access for select
  to authenticated
  using (user_id = auth.uid());
