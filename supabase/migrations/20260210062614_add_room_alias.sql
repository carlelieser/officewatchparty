create or replace function generate_room_alias() returns text as $$
declare
  chars text := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result text := '';
  i int;
begin
  for i in 1..8 loop
    result := result || substr(chars, floor(random() * 36 + 1)::int, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

alter table rooms add column alias text not null unique default generate_room_alias();
