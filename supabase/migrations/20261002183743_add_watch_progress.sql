-- Track playback progress so the home page can offer "continue watching" and the
-- watch page can resume at the saved timestamp.
alter table watch_history add column progress_seconds real not null default 0;
alter table watch_history add column duration_seconds real not null default 0;
