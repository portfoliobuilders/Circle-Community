-- CIRCLE Part 15: Core Video Clipping Engine Schema & Creator Platforms
-- Follows AGENTS.md, docs/CLIPPING_PLAN.md, docs/CLIPPING_CONFIG.md

-- 1. Creator Platforms (Bio-Code Account Verification & Follower Counts)
create table public.creator_platforms (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  platform text not null check (platform in ('youtube_shorts', 'instagram_reels')),
  handle text not null check (char_length(handle) between 1 and 80),
  platform_account_id text check (platform_account_id is null or char_length(platform_account_id) <= 120),
  verification_code text not null check (char_length(verification_code) between 4 and 16),
  code_expires_at timestamptz not null default (now() + interval '72 hours'),
  verified boolean not null default false,
  verified_at timestamptz,
  admin_verified_followers integer check (admin_verified_followers is null or admin_verified_followers >= 0),
  followers_verified_at timestamptz,
  followers_verified_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index creator_platforms_verified_unique 
  on public.creator_platforms (platform, lower(handle)) 
  where verified = true;

create index creator_platforms_profile_idx on public.creator_platforms (profile_id);

-- 2. Clipping Campaigns Entity
create table public.clip_campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (char_length(slug) between 3 and 100),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  campaign_type text not null default 'clipping' check (campaign_type in ('clipping', 'social_pr')),
  title text not null check (char_length(title) between 4 and 120),
  summary text not null check (char_length(summary) <= 200),
  brief_md text not null check (char_length(brief_md) between 10 and 20000),
  rules_md text not null default '',
  category text not null check (char_length(category) between 2 and 50),
  language text not null default 'en',
  source_links jsonb not null default '[]'::jsonb,
  asset_folder_url text,
  platforms text[] not null check (platforms <@ array['youtube_shorts', 'instagram_reels']::text[]),
  rate_inr_per_1k integer check (rate_inr_per_1k is null or (rate_inr_per_1k between 10 and 200)),
  budget_inr integer not null check (budget_inr > 0),
  owner_fee_inr integer not null default 0 check (owner_fee_inr >= 0),
  budget_reserved_inr integer not null default 0 check (budget_reserved_inr >= 0 and budget_reserved_inr <= budget_inr),
  budget_paid_inr integer not null default 0 check (budget_paid_inr >= 0 and budget_paid_inr <= budget_inr),
  per_clip_view_cap integer check (per_clip_view_cap is null or per_clip_view_cap >= 1000),
  per_clipper_cap_inr integer check (per_clipper_cap_inr is null or per_clipper_cap_inr > 0),
  min_views_to_qualify integer not null default 1000 check (min_views_to_qualify >= 0),
  -- Forward-compatible fields for Social Media PR
  deliverable_type text check (deliverable_type in ('reel', 'post', 'carousel', 'story', 'short')),
  fee_per_post_inr integer check (fee_per_post_inr is null or fee_per_post_inr > 0),
  slots integer check (slots is null or slots >= 1),
  pricing_mode text check (pricing_mode in ('fixed', 'quote')),
  min_followers integer default 10000 check (min_followers is null or min_followers >= 10000),
  max_followers integer check (max_followers is null or max_followers >= min_followers),
  niches text[] not null default '{}'::text[],
  cities text[] not null default '{}'::text[],
  required_caption text,
  required_hashtags text[] not null default '{}'::text[],
  required_mention text,
  required_link text,
  content_approval_required boolean not null default false,
  subject_type text check (subject_type in ('brand', 'individual')),
  subject_consent_confirmed_at timestamptz,
  -- Governance & funding status
  disclosure_required boolean not null default true check (disclosure_required),
  rights_confirmed_at timestamptz,
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'pending_review', 'approved', 'funded', 'live', 'paused', 'ended', 'removed')),
  funded_at timestamptz,
  funded_ref text,
  cover_path text,
  created_at timestamptz not null default now(),
  constraint clip_campaigns_rights_check check (status = 'draft' or rights_confirmed_at is not null),
  constraint clip_campaigns_funded_check check (status != 'live' or (funded_at is not null and funded_ref is not null)),
  constraint clip_campaigns_type_config_check check (
    (campaign_type = 'clipping' and rate_inr_per_1k is not null and per_clip_view_cap is not null) or
    (campaign_type = 'social_pr' and deliverable_type is not null and pricing_mode is not null and slots is not null and (min_followers is null or min_followers >= 10000))
  )
);

create index clip_campaigns_status_idx on public.clip_campaigns (status);
create index clip_campaigns_owner_idx on public.clip_campaigns (owner_id);

-- 3. Campaign Membership (Clippers who joined the campaign)
create table public.clip_campaign_members (
  campaign_id uuid not null references public.clip_campaigns(id) on delete restrict,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  joined_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'removed')),
  primary key (campaign_id, profile_id)
);

-- 4. Clip Submissions
create table public.clip_submissions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.clip_campaigns(id) on delete restrict,
  clipper_id uuid not null references public.profiles(id) on delete restrict,
  platform text not null check (platform in ('youtube_shorts', 'instagram_reels')),
  post_url text not null check (char_length(post_url) between 10 and 500),
  post_id_normalised text not null check (char_length(post_id_normalised) between 2 and 100),
  platform_account_id uuid not null references public.creator_platforms(id) on delete restrict,
  posted_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'removed', 'disqualified')),
  reject_reason text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (platform, post_id_normalised)
);

create index clip_submissions_campaign_idx on public.clip_submissions (campaign_id);
create index clip_submissions_clipper_idx on public.clip_submissions (clipper_id);
create index clip_submissions_status_idx on public.clip_submissions (status);

-- 5. Promoted Slots Auction Tables
create table public.clip_promo_weeks (
  week_start date primary key,
  status text not null default 'open' check (status in ('open', 'closed', 'settled')),
  bidding_closed_at timestamptz,
  settled_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.clip_promo_bids (
  id uuid primary key default gen_random_uuid(),
  week_start date not null references public.clip_promo_weeks(week_start) on delete restrict,
  campaign_id uuid not null references public.clip_campaigns(id) on delete restrict,
  owner_id uuid not null references public.profiles(id) on delete restrict,
  bid_inr integer not null check (bid_inr > 0),
  status text not null default 'placed' check (status in ('placed', 'won', 'lost', 'paid', 'forfeited')),
  slot_position integer check (slot_position between 1 and 3),
  paid_ref text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  unique (week_start, campaign_id)
);

-- 6. Admin Actions (Audit Trail)
create table public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete restrict,
  action text not null,
  target_type text not null,
  target_id uuid not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index admin_actions_target_idx on public.admin_actions (target_type, target_id);

-- Row Level Security (RLS) Policies
alter table public.creator_platforms enable row level security;
alter table public.clip_campaigns enable row level security;
alter table public.clip_campaign_members enable row level security;
alter table public.clip_submissions enable row level security;
alter table public.clip_promo_weeks enable row level security;
alter table public.clip_promo_bids enable row level security;
alter table public.admin_actions enable row level security;

-- Policies for creator_platforms
create policy "creator_platforms_select"
  on public.creator_platforms for select to anon, authenticated
  using (
    verified = true
    or profile_id = auth.uid()
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "creator_platforms_insert"
  on public.creator_platforms for insert to authenticated
  with check (profile_id = auth.uid());

create policy "creator_platforms_update"
  on public.creator_platforms for update to authenticated
  using (
    profile_id = auth.uid()
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  )
  with check (
    profile_id = auth.uid()
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "creator_platforms_delete"
  on public.creator_platforms for delete to authenticated
  using (
    (profile_id = auth.uid() and verified = false)
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

-- Policies for clip_campaigns
create policy "clip_campaigns_select_public"
  on public.clip_campaigns for select to anon, authenticated
  using (
    status in ('live', 'ended', 'paused')
    or owner_id = auth.uid()
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "clip_campaigns_insert_brand"
  on public.clip_campaigns for insert to authenticated
  with check (
    owner_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'brand'
    )
  );

create policy "clip_campaigns_update_owner_or_admin"
  on public.clip_campaigns for update to authenticated
  using (
    (owner_id = auth.uid() and status in ('draft', 'paused'))
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  )
  with check (
    (owner_id = auth.uid() and status in ('draft', 'pending_review', 'paused'))
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

-- Policies for clip_campaign_members
create policy "clip_campaign_members_select"
  on public.clip_campaign_members for select to authenticated
  using (
    profile_id = auth.uid()
    or exists (select 1 from public.clip_campaigns c where c.id = campaign_id and c.owner_id = auth.uid())
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "clip_campaign_members_insert"
  on public.clip_campaign_members for insert to authenticated
  with check (
    profile_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'creator'
        and p.date_of_birth is not null
        and p.date_of_birth <= (current_date - interval '18 years')
    )
    and exists (
      select 1 from public.clip_campaigns c
      where c.id = campaign_id and c.status = 'live'
    )
  );

-- Policies for clip_submissions
create policy "clip_submissions_select"
  on public.clip_submissions for select to authenticated
  using (
    clipper_id = auth.uid()
    or exists (select 1 from public.clip_campaigns c where c.id = campaign_id and c.owner_id = auth.uid())
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "clip_submissions_insert"
  on public.clip_submissions for insert to authenticated
  with check (
    clipper_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'creator'
        and p.date_of_birth is not null
        and p.date_of_birth <= (current_date - interval '18 years')
    )
    and exists (
      select 1 from public.creator_platforms cp
      where cp.id = platform_account_id
        and cp.profile_id = auth.uid()
        and cp.verified = true
    )
    and exists (
      select 1 from public.clip_campaigns c
      where c.id = campaign_id and c.status = 'live'
    )
  );

create policy "clip_submissions_update_moderator"
  on public.clip_submissions for update to authenticated
  using (
    exists (select 1 from public.clip_campaigns c where c.id = campaign_id and c.owner_id = auth.uid())
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  )
  with check (
    exists (select 1 from public.clip_campaigns c where c.id = campaign_id and c.owner_id = auth.uid())
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

-- Policies for promo weeks & bids
create policy "clip_promo_weeks_select"
  on public.clip_promo_weeks for select to authenticated
  using (true);

create policy "clip_promo_weeks_admin"
  on public.clip_promo_weeks for all to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false))
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false));

create policy "clip_promo_bids_select"
  on public.clip_promo_bids for select to authenticated
  using (
    owner_id = auth.uid()
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "clip_promo_bids_insert"
  on public.clip_promo_bids for insert to authenticated
  with check (
    owner_id = auth.uid()
    and exists (
      select 1 from public.clip_campaigns c
      where c.id = campaign_id and c.owner_id = auth.uid() and c.status in ('funded', 'live')
    )
  );

create policy "clip_promo_bids_update"
  on public.clip_promo_bids for update to authenticated
  using (
    owner_id = auth.uid()
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  )
  with check (
    owner_id = auth.uid()
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

-- Policies for admin_actions
create policy "admin_actions_select"
  on public.admin_actions for select to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false));

create policy "admin_actions_insert"
  on public.admin_actions for insert to authenticated
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false));
