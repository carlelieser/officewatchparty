-- The earlier revoke targeted `anon`, but EXECUTE is granted to PUBLIC by
-- default, which anon inherits — so anon kept access. Revoke from PUBLIC (and
-- anon explicitly) and keep the explicit grant to authenticated so only
-- signed-in users can call these watch-page RPCs.
revoke execute on function get_episode_comments(integer, integer) from public, anon;
revoke execute on function get_episode_reaction_counts(integer, integer) from public, anon;
revoke execute on function get_user_episode_reactions(integer, integer) from public, anon;

grant execute on function get_episode_comments(integer, integer) to authenticated;
grant execute on function get_episode_reaction_counts(integer, integer) to authenticated;
grant execute on function get_user_episode_reactions(integer, integer) to authenticated;
