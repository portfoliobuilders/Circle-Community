-- CIRCLE Part 16: Verification, Earnings Engine, Double-Row Wallet Ledger, Payouts & Anti-Fraud
-- Follows AGENTS.md, docs/CLIPPING_PLAN.md, docs/CLIPPING_CONFIG.md

-- 1. View Snapshots (Append-Only)
create table public.clip_view_snapshots (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.clip_submissions(id) on delete restrict,
  views bigint not null check (views >= 0),
  likes bigint check (likes is null or likes >= 0),
  comments bigint check (comments is null or comments >= 0),
  source text not null check (source in ('youtube_api', 'admin_verified', 'clipper_reported')),
  is_live boolean not null default true,
  evidence_path text,
  captured_by uuid references public.profiles(id) on delete set null,
  captured_at timestamptz not null default now()
);

create index clip_view_snapshots_sub_idx on public.clip_view_snapshots (submission_id, captured_at desc);

-- 2. Clip Earnings (Single-Count Day 7 Record)
create table public.clip_earnings (
  submission_id uuid primary key references public.clip_submissions(id) on delete restrict,
  verified_views bigint not null default 0 check (verified_views >= 0),
  payable_views bigint not null default 0 check (payable_views >= 0),
  gross_amount_inr integer not null default 0 check (gross_amount_inr >= 0),
  fee_amount_inr integer not null default 0 check (fee_amount_inr >= 0),
  net_amount_inr integer not null default 0 check (net_amount_inr >= 0),
  status text not null default 'accruing' check (status in ('accruing', 'payable', 'paid', 'void')),
  locked_at timestamptz,
  updated_at timestamptz not null default now()
);

-- 3. Unified Wallet Ledger (Append-Only Financial Log)
create table public.clip_wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete restrict,
  type text not null check (type in ('earning', 'fee', 'payout', 'adjustment', 'reversal', 'fee_reversal')),
  amount_inr integer not null check (amount_inr <> 0),
  ref_type text not null check (ref_type in ('clip_submission', 'pr_deliverable', 'payout_request', 'admin_adjustment')),
  ref_id uuid not null,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (type, ref_type, ref_id)
);

create index clip_wallet_ledger_profile_idx on public.clip_wallet_ledger (profile_id, created_at desc);

-- 4. UPI Payout Requests
create table public.clip_payout_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete restrict,
  amount_inr integer not null check (amount_inr > 0),
  upi_id_encrypted text not null check (char_length(upi_id_encrypted) between 5 and 500),
  status text not null default 'requested' check (status in ('requested', 'processing', 'paid', 'failed', 'rejected')),
  paid_ref text,
  paid_at timestamptz,
  processed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index clip_payout_requests_profile_idx on public.clip_payout_requests (profile_id);
create index clip_payout_requests_status_idx on public.clip_payout_requests (status);

-- 5. Anti-Fraud Flags
create table public.clip_fraud_flags (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references public.clip_submissions(id) on delete restrict,
  deliverable_id uuid,
  rule text not null,
  detail jsonb not null default '{}'::jsonb,
  status text not null default 'open' check (status in ('open', 'cleared', 'confirmed')),
  created_at timestamptz not null default now()
);

create index clip_fraud_flags_sub_idx on public.clip_fraud_flags (submission_id);

-- 6. Storage Bucket for Instagram Insights Evidence
insert into storage.buckets (id, name, public)
values ('clip-evidence', 'clip-evidence', false)
on conflict (id) do nothing;

-- 7. Platform Revenue Reporting View
create or replace view public.clip_platform_revenue_view with (security_invoker = false) as
select
  c.id as campaign_id,
  c.title as campaign_title,
  c.owner_id,
  c.campaign_type,
  date_trunc('month', c.funded_at) as revenue_month,
  c.owner_fee_inr as owner_fee_earned_inr,
  coalesce(sum(case 
    when l.type = 'fee' then abs(l.amount_inr) 
    when l.type = 'fee_reversal' then -abs(l.amount_inr) 
    else 0 
  end), 0) as creator_fees_earned_inr,
  (c.owner_fee_inr + coalesce(sum(case 
    when l.type = 'fee' then abs(l.amount_inr) 
    when l.type = 'fee_reversal' then -abs(l.amount_inr) 
    else 0 
  end), 0)) as total_platform_fee_inr
from public.clip_campaigns c
left join public.clip_submissions s on s.campaign_id = c.id
left join public.clip_wallet_ledger l on l.ref_id = s.id and l.ref_type = 'clip_submission' and l.type in ('fee', 'fee_reversal')
where c.status in ('funded', 'live', 'ended')
group by c.id, c.title, c.owner_id, c.campaign_type, c.funded_at, c.owner_fee_inr;

-- Row Level Security (RLS) Policies
alter table public.clip_view_snapshots enable row level security;
alter table public.clip_earnings enable row level security;
alter table public.clip_wallet_ledger enable row level security;
alter table public.clip_payout_requests enable row level security;
alter table public.clip_fraud_flags enable row level security;

-- Policies for clip_view_snapshots
create policy "clip_view_snapshots_select"
  on public.clip_view_snapshots for select to authenticated
  using (
    exists (
      select 1 from public.clip_submissions s
      where s.id = submission_id
        and (s.clipper_id = auth.uid()
          or exists (select 1 from public.clip_campaigns c where c.id = s.campaign_id and c.owner_id = auth.uid()))
    )
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "clip_view_snapshots_insert"
  on public.clip_view_snapshots for insert to authenticated
  with check (
    (
      source = 'clipper_reported'
      and exists (select 1 from public.clip_submissions s where s.id = submission_id and s.clipper_id = auth.uid())
    )
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

-- Policies for clip_earnings
create policy "clip_earnings_select"
  on public.clip_earnings for select to authenticated
  using (
    exists (
      select 1 from public.clip_submissions s
      where s.id = submission_id
        and (s.clipper_id = auth.uid()
          or exists (select 1 from public.clip_campaigns c where c.id = s.campaign_id and c.owner_id = auth.uid()))
    )
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "clip_earnings_admin"
  on public.clip_earnings for all to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false))
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false));

-- Policies for clip_wallet_ledger
create policy "clip_wallet_ledger_select"
  on public.clip_wallet_ledger for select to authenticated
  using (
    profile_id = auth.uid()
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "clip_wallet_ledger_admin"
  on public.clip_wallet_ledger for insert to authenticated
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false));

-- Policies for clip_payout_requests
create policy "clip_payout_requests_select"
  on public.clip_payout_requests for select to authenticated
  using (
    profile_id = auth.uid()
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );

create policy "clip_payout_requests_insert"
  on public.clip_payout_requests for insert to authenticated
  with check (profile_id = auth.uid());

create policy "clip_payout_requests_update"
  on public.clip_payout_requests for update to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false))
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false));

-- Policies for clip_fraud_flags
create policy "clip_fraud_flags_admin"
  on public.clip_fraud_flags for all to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false))
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false));

-- Policies for storage bucket: clip-evidence
create policy "clip_evidence_select"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'clip-evidence'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
    )
  );

create policy "clip_evidence_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'clip-evidence'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
