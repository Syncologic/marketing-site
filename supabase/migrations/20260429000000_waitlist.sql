create extension if not exists "pgcrypto";

create table if not exists waitlist (
  id                          uuid primary key default gen_random_uuid(),
  email                       text not null unique,
  source_page                 text,
  segment_hint                text,
  locale                      text default 'en',
  use_case                    text,
  source_provider             text,
  dest_provider               text,
  est_size                    text,
  frequency                   text,
  preferred_runner            text,
  role                        text,
  user_agent                  text,
  referrer                    text,
  ip_hash                     text,
  unsubscribe_token           text default encode(extensions.gen_random_bytes(16), 'hex'),
  segmentation_completed_at   timestamptz,
  removed_at                  timestamptz,
  confirmed_at                timestamptz,
  created_at                  timestamptz default now(),
  updated_at                  timestamptz default now()
);

create index if not exists waitlist_use_case_idx on waitlist(use_case);
create index if not exists waitlist_locale_idx   on waitlist(locale);
create index if not exists waitlist_created_idx  on waitlist(created_at desc);
create index if not exists waitlist_unsub_idx    on waitlist(unsubscribe_token);

create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists waitlist_updated_at on waitlist;
create trigger waitlist_updated_at
  before update on waitlist
  for each row execute function set_updated_at();

alter table waitlist enable row level security;

drop policy if exists waitlist_insert_anon on waitlist;
create policy waitlist_insert_anon on waitlist
  for insert with check (false);

drop policy if exists waitlist_service_all on waitlist;
create policy waitlist_service_all on waitlist
  for all to service_role using (true) with check (true);

grant select, insert, update, delete on waitlist to service_role;
