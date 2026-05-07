alter table waitlist
  add column if not exists rejoin_count int not null default 0;
