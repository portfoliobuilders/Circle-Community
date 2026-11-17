-- Creator discovery fields, giveaways, affiliate listings, and challenges.
-- Do not edit earlier migrations.

alter table public.profiles
  add column if not exists category text,
  add column if not exists content_summary text,
  add column if not exists instagram_url text,
  add column if not exists youtube_url text,
  add column if not exists other_url text,
  add column if not exists open_to_collab boolean not null default true,
  add column if not exists open_to_ads boolean not null default false,
  add column if not exists open_to_giveaway boolean not null default false,
  add column if not exists open_to_affiliate boolean not null default false;

alter table public.profiles drop constraint if exists profiles_category_check;
alter table public.profiles add constraint profiles_category_check check (
  category is null or category in (
    'automobile', 'comedy', 'education', 'finance', 'parenting', 'beauty',
    'fitness', 'food', 'gaming', 'tech', 'travel', 'lifestyle', 'fashion', 'music', 'other'
  )
);

alter table public.profiles drop constraint if exists profiles_content_summary_len;
alter table public.profiles add constraint profiles_content_summary_len check (
  content_summary is null or char_length(content_summary) <= 1000
);

drop view if exists public.profile_cards;
create view public.profile_cards with (security_invoker = false) as
select
  id,
  role,
  display_name,
  city,
  bio,
  category,
  content_summary,
  instagram_url,
  youtube_url,
  other_url,
  open_to_collab,
  open_to_ads,
  open_to_giveaway,
  open_to_affiliate,
  offers_services,
  service_title,
  platforms,
  follower_count,
  follower_status,
  rates_visible,
  case when rates_visible then price_from_inr else null end as price_from_inr,
  created_at
from public.profiles;

grant select on public.profile_cards to anon, authenticated;

create table public.giveaways (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 4 and 120),
  summary text not null check (char_length(summary) between 20 and 2000),
  prize text not null check (char_length(prize) between 2 and 200),
  ends_at timestamptz,
  social_url text not null check (social_url like 'https://%'),
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create table public.affiliate_offers (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 4 and 120),
  summary text not null check (char_length(summary) between 20 and 2000),
  terms text not null check (char_length(terms) between 10 and 1000),
  destination_url text not null check (destination_url like 'https://%'),
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 4 and 120),
  summary text not null check (char_length(summary) between 20 and 2000),
  audience text not null check (audience in ('creator', 'brand', 'anyone')),
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.giveaways enable row level security;
alter table public.affiliate_offers enable row level security;
alter table public.challenges enable row level security;

create policy "giveaways_public_read"
  on public.giveaways for select to anon, authenticated
  using (status = 'open' or owner_id = auth.uid());

create policy "giveaways_owner_insert"
  on public.giveaways for insert to authenticated
  with check (owner_id = auth.uid());

create policy "giveaways_owner_update"
  on public.giveaways for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "affiliates_public_read"
  on public.affiliate_offers for select to anon, authenticated
  using (status = 'open' or brand_id = auth.uid());

create policy "affiliates_brand_insert"
  on public.affiliate_offers for insert to authenticated
  with check (
    brand_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'brand')
  );

create policy "challenges_public_read"
  on public.challenges for select to anon, authenticated
  using (true);

create policy "challenges_admin_write"
  on public.challenges for all to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false))
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false));

revoke all on public.giveaways from anon, authenticated;
grant select on public.giveaways to anon, authenticated;
grant insert, update on public.giveaways to authenticated;

revoke all on public.affiliate_offers from anon, authenticated;
grant select on public.affiliate_offers to anon, authenticated;
grant insert on public.affiliate_offers to authenticated;

revoke all on public.challenges from anon, authenticated;
grant select on public.challenges to anon, authenticated;
grant select, insert, update, delete on public.challenges to authenticated;
