-- Profiles, collabs, events, reports, and the points ledger.
-- Do not recreate these tables later; add a new migration.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('creator', 'brand')),
  display_name text not null check (char_length(display_name) between 2 and 80),
  city text check (city is null or char_length(city) <= 80),
  bio text check (bio is null or char_length(bio) <= 500),
  date_of_birth date,
  offers_services boolean not null default false,
  service_title text check (service_title is null or char_length(service_title) <= 80),
  price_from_inr integer check (price_from_inr is null or price_from_inr >= 0),
  platforms text check (platforms is null or char_length(platforms) <= 200),
  follower_count integer check (follower_count is null or follower_count >= 0),
  follower_status text not null default 'self_reported' check (follower_status in ('self_reported', 'verified')),
  rates_visible boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.collabs (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 4 and 120),
  summary text not null check (char_length(summary) between 20 and 2000),
  kind text not null check (kind in ('fixed', 'open_bid', 'barter')),
  budget_inr integer check (budget_inr is null or budget_inr >= 0),
  barter_offer text check (barter_offer is null or char_length(barter_offer) <= 200),
  ad_disclosure boolean not null default true check (ad_disclosure),
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now(),
  constraint collabs_money check (
    (kind = 'fixed' and budget_inr is not null)
    or (kind = 'open_bid')
    or (kind = 'barter' and budget_inr is null and barter_offer is not null)
  )
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  collab_id uuid not null references public.collabs (id) on delete cascade,
  creator_id uuid not null references public.profiles (id) on delete cascade,
  pitch text not null check (char_length(pitch) between 20 and 2000),
  bid_inr integer check (bid_inr is null or bid_inr >= 0),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  unique (collab_id, creator_id)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 4 and 120),
  summary text not null check (char_length(summary) between 10 and 1000),
  kind text not null check (kind in ('meetup', 'webinar', 'bootcamp', 'community')),
  starts_at timestamptz not null,
  city text check (city is null or char_length(city) <= 80),
  created_at timestamptz not null default now()
);

create table public.event_registrations (
  event_id uuid not null references public.events (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, profile_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  target_type text not null check (target_type in ('profile', 'collab')),
  target_id uuid not null,
  message text not null check (char_length(message) between 20 and 1000),
  created_at timestamptz not null default now()
);

create table public.point_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  points integer not null check (points <> 0),
  reason text not null check (char_length(reason) between 4 and 200),
  source text not null check (source in ('collab_completed', 'event_attended', 'admin_task')),
  created_at timestamptz not null default now()
);

create view public.profile_cards with (security_invoker = false) as
select
  id,
  role,
  display_name,
  city,
  bio,
  offers_services,
  service_title,
  platforms,
  follower_count,
  follower_status,
  rates_visible,
  case when rates_visible then price_from_inr else null end as price_from_inr,
  created_at
from public.profiles;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  chosen text;
  dob date;
begin
  chosen := case when new.raw_user_meta_data ->> 'role' = 'brand' then 'brand' else 'creator' end;
  begin
    dob := nullif(new.raw_user_meta_data ->> 'date_of_birth', '')::date;
  exception when others then
    dob := null;
  end;
  insert into public.profiles (id, display_name, role, date_of_birth)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), 'Member'),
    chosen,
    dob
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.protect_profile_trust()
returns trigger
language plpgsql
as $$
begin
  if coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false) then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.follower_status := 'self_reported';
    return new;
  end if;
  new.role := old.role;
  new.follower_status := old.follower_status;
  new.id := old.id;
  return new;
end;
$$;

create trigger profiles_protect_trust
  before insert or update on public.profiles
  for each row execute function public.protect_profile_trust();

alter table public.profiles enable row level security;
alter table public.collabs enable row level security;
alter table public.applications enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.reports enable row level security;
alter table public.point_events enable row level security;

create policy "profiles_select_own_or_admin"
  on public.profiles for select to authenticated
  using (
    id = auth.uid()
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "profiles_insert_own"
  on public.profiles for insert to authenticated
  with check (id = auth.uid());

create policy "profiles_update_own_or_admin"
  on public.profiles for update to authenticated
  using (
    id = auth.uid()
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  )
  with check (
    id = auth.uid()
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "collabs_public_read"
  on public.collabs for select to anon, authenticated
  using (true);

create policy "collabs_brand_insert"
  on public.collabs for insert to authenticated
  with check (
    brand_id = auth.uid()
    and ad_disclosure = true
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'brand')
  );

create policy "collabs_brand_update"
  on public.collabs for update to authenticated
  using (brand_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false))
  with check (
    ad_disclosure = true
    and (brand_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false))
  );

create policy "applications_select_parties"
  on public.applications for select to authenticated
  using (
    creator_id = auth.uid()
    or exists (select 1 from public.collabs c where c.id = collab_id and c.brand_id = auth.uid())
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "applications_creator_insert"
  on public.applications for insert to authenticated
  with check (
    creator_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'creator'
        and p.date_of_birth is not null
        and p.date_of_birth <= (current_date - interval '18 years')
    )
    and exists (
      select 1 from public.collabs c
      where c.id = collab_id and c.status = 'open'
    )
  );

create policy "applications_brand_update"
  on public.applications for update to authenticated
  using (
    exists (select 1 from public.collabs c where c.id = collab_id and c.brand_id = auth.uid())
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  )
  with check (
    exists (select 1 from public.collabs c where c.id = collab_id and c.brand_id = auth.uid())
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "events_public_read"
  on public.events for select to anon, authenticated
  using (true);

create policy "events_admin_write"
  on public.events for all to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false))
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false));

create policy "registrations_select_own"
  on public.event_registrations for select to authenticated
  using (
    profile_id = auth.uid()
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "registrations_insert_own"
  on public.event_registrations for insert to authenticated
  with check (profile_id = auth.uid());

create policy "reports_insert_own"
  on public.reports for insert to authenticated
  with check (reporter_id = auth.uid());

create policy "reports_select_own_or_admin"
  on public.reports for select to authenticated
  using (
    reporter_id = auth.uid()
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "points_public_read"
  on public.point_events for select to anon, authenticated
  using (true);

create policy "points_admin_insert"
  on public.point_events for insert to authenticated
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false));

revoke all on public.profiles from anon;
grant select, insert, update on public.profiles to authenticated;
grant select on public.profile_cards to anon, authenticated;

revoke all on public.collabs from anon, authenticated;
grant select on public.collabs to anon, authenticated;
grant insert, update on public.collabs to authenticated;

revoke all on public.applications from anon;
grant select, insert, update on public.applications to authenticated;

revoke all on public.events from anon, authenticated;
grant select on public.events to anon, authenticated;
grant select, insert, update, delete on public.events to authenticated;

revoke all on public.event_registrations from anon;
grant select, insert on public.event_registrations to authenticated;

revoke all on public.reports from anon;
grant select, insert on public.reports to authenticated;

revoke all on public.point_events from anon, authenticated;
grant select on public.point_events to anon, authenticated;
grant insert on public.point_events to authenticated;
