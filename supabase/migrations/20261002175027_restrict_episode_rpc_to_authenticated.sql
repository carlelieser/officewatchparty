-- The watch page is sign-in gated, so its SECURITY DEFINER RPCs should only be
-- callable by authenticated users, not the anonymous REST role. (The read
-- functions use permissive RLS, so leaving them open to anon would expose the
-- shared threads via the raw /rest/v1/rpc endpoints.)
revoke execute on function get_episode_comments(integer, integer) from anon;
revoke execute on function get_episode_reaction_counts(integer, integer) from anon;
revoke execute on function get_user_episode_reactions(integer, integer) from anon;
