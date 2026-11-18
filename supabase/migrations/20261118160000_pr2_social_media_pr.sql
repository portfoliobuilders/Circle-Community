-- CIRCLE Social Media PR Campaign Engine (PR2)
-- Pay-per-post campaigns for 10K+ admin-verified accounts
-- Reuses clip_campaigns, creator_platforms, clip_wallet_ledger, clip_payout_requests, and admin_actions

-- 1. Enforce Subject Consent for Individual Promotions
alter table public.clip_campaigns
  add constraint clip_campaigns_pr_consent_check check (
    campaign_type != 'social_pr' or
    subject_type != 'individual' or
    status = 'draft' or
    subject_consent_confirmed_at is not null
  );

-- 2. PR Applications
-- Established creators (>= 10,000 verified followers) apply to a campaign with a pitch and optional quote
create table public.pr_applications (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.clip_campaigns(id) on delete restrict,
  creator_id uuid not null references public.profiles(id) on delete restrict,
  platform_account_id uuid not null references public.creator_platforms(id) on delete restrict,
  pitch text not null check (char_length(pitch) between 20 and 2000),
  quote_inr integer check (quote_inr is null or quote_inr > 0),
  status text not null default 'applied' check (status in ('applied', 'accepted', 'rejected', 'withdrawn', 'cancelled')),
  created_at timestamptz not null default now(),
  unique (campaign_id, creator_id)
);

create index pr_applications_campaign_idx on public.pr_applications (campaign_id);
create index pr_applications_creator_idx on public.pr_applications (creator_id);
create index pr_applications_status_idx on public.pr_applications (status);

-- 3. PR Deliverables
-- Created upon application acceptance; handles draft submission, owner review, live post verification, and 7-day live maturation hold
create table public.pr_deliverables (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.pr_applications(id) on delete restrict,
  draft_path text,
  draft_status text not null default 'none' check (draft_status in ('none', 'submitted', 'approved', 'changes_requested')),
  revision_count integer not null default 0 check (revision_count between 0 and 1),
  post_url text check (post_url is null or char_length(post_url) between 10 and 500),
  post_id_normalised text,
  posted_at_submitted timestamptz,
  live_checks jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'live_verified', 'payable', 'paid', 'failed')),
  fail_reason text,
  created_at timestamptz not null default now()
);

create unique index pr_deliverables_post_id_idx on public.pr_deliverables (post_id_normalised) where post_id_normalised is not null;
create index pr_deliverables_status_idx on public.pr_deliverables (status);

-- 4. Private Storage Bucket for Draft Review
insert into storage.buckets (id, name, public)
values ('pr-drafts', 'pr-drafts', false)
on conflict (id) do nothing;

-- 5. Row Level Security Policies

-- Enable RLS
alter table public.pr_applications enable row level security;
alter table public.pr_deliverables enable row level security;

-- pr_applications policies
create policy pr_applications_select_creator on public.pr_applications
  for select using (auth.uid() = creator_id);

create policy pr_applications_select_owner on public.pr_applications
  for select using (
    exists (
      select 1 from public.clip_campaigns c
      where c.id = campaign_id and c.owner_id = auth.uid()
    )
  );

create policy pr_applications_select_admin on public.pr_applications
  for select using (
    coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false) = true
  );

create policy pr_applications_insert_creator on public.pr_applications
  for insert with check (
    auth.uid() = creator_id and
    exists (
      select 1 from public.clip_campaigns c
      where c.id = campaign_id and c.status = 'live' and c.campaign_type = 'social_pr'
    )
  );

create policy pr_applications_update_creator on public.pr_applications
  for update using (
    auth.uid() = creator_id and status = 'applied'
  ) with check (
    status in ('applied', 'withdrawn')
  );

create policy pr_applications_update_owner on public.pr_applications
  for update using (
    exists (
      select 1 from public.clip_campaigns c
      where c.id = campaign_id and c.owner_id = auth.uid()
    )
  );

create policy pr_applications_update_admin on public.pr_applications
  for update using (
    coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false) = true
  );

-- pr_deliverables policies
create policy pr_deliverables_select_creator on public.pr_deliverables
  for select using (
    exists (
      select 1 from public.pr_applications a
      where a.id = application_id and a.creator_id = auth.uid()
    )
  );

create policy pr_deliverables_select_owner on public.pr_deliverables
  for select using (
    exists (
      select 1 from public.pr_applications a
      join public.clip_campaigns c on c.id = a.campaign_id
      where a.id = application_id and c.owner_id = auth.uid()
    )
  );

create policy pr_deliverables_select_admin on public.pr_deliverables
  for select using (
    coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false) = true
  );

create policy pr_deliverables_insert_owner on public.pr_deliverables
  for insert with check (
    exists (
      select 1 from public.pr_applications a
      join public.clip_campaigns c on c.id = a.campaign_id
      where a.id = application_id and (c.owner_id = auth.uid() or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false) = true)
    )
  );

create policy pr_deliverables_update_creator on public.pr_deliverables
  for update using (
    exists (
      select 1 from public.pr_applications a
      where a.id = application_id and a.creator_id = auth.uid()
    )
  );

create policy pr_deliverables_update_owner on public.pr_deliverables
  for update using (
    exists (
      select 1 from public.pr_applications a
      join public.clip_campaigns c on c.id = a.campaign_id
      where a.id = application_id and c.owner_id = auth.uid()
    )
  );

create policy pr_deliverables_update_admin on public.pr_deliverables
  for update using (
    coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false) = true
  );

-- Storage policies for pr-drafts
create policy pr_drafts_upload on storage.objects
  for insert with check (
    bucket_id = 'pr-drafts' and
    auth.role() = 'authenticated'
  );

create policy pr_drafts_select on storage.objects
  for select using (
    bucket_id = 'pr-drafts' and
    auth.role() = 'authenticated'
  );
