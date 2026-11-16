-- Part 10: contact, FAQs, partnership leads, newsletter.
-- Part 7's leads table did not exist. This migration creates it with partner_type.
-- Do not recreate these tables in a later part; add a new migration instead.

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  topic text not null check (topic in (
    'General question',
    'Partnership / sponsorship',
    'Brand enquiry',
    'Report a problem',
    'Press',
    'Other'
  )),
  message text not null check (char_length(message) between 20 and 2000),
  user_id uuid references auth.users (id) on delete set null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  assigned_to uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key,
  category text not null check (category in (
    'Getting started',
    'Collabs & bids',
    'Brands',
    'Events & learning',
    'Points & badges',
    'Safety & verification',
    'Account & privacy'
  )),
  question text not null,
  answer_md text not null,
  sort integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  service_slug text not null,
  audience text not null check (audience in ('brand', 'creator', 'partner')),
  name text not null,
  company text,
  email text not null,
  phone text,
  instagram_or_site text,
  budget_range text,
  message text,
  consent boolean not null check (consent),
  source_page text,
  partner_type text check (partner_type in ('perk', 'venue', 'sponsor', 'educator')),
  status text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost')),
  assigned_to uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'unsubscribed')),
  source text,
  confirm_token text unique,
  confirm_expires_at timestamptz,
  unsubscribe_token text unique,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

alter table public.contact_messages enable row level security;
alter table public.faqs enable row level security;
alter table public.leads enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "contact_messages_admin_select"
  on public.contact_messages for select to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false));

create policy "contact_messages_admin_update"
  on public.contact_messages for update to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false))
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false));

create policy "faqs_public_read"
  on public.faqs for select to anon, authenticated
  using (published = true);

create policy "faqs_admin_write"
  on public.faqs for all to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false))
  with check (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false));

create policy "leads_admin_select"
  on public.leads for select to authenticated
  using (coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false));

create policy "newsletter_no_client_read"
  on public.newsletter_subscribers for select to anon, authenticated
  using (false);

revoke all on public.contact_messages from anon, authenticated;
revoke all on public.leads from anon, authenticated;
revoke all on public.newsletter_subscribers from anon, authenticated;
grant select, update on public.contact_messages to authenticated;
grant select on public.faqs to anon, authenticated;
grant select, insert, update, delete on public.faqs to authenticated;
grant select on public.leads to authenticated;

insert into public.faqs (id, category, question, answer_md, sort, published) values
('00000000-0000-4000-8000-000000000001', 'Getting started', 'Is CIRCLE really free?',
 'Yes. Joining is free, and there is no member paywall. Collab budgets are shown on the brief. When money is involved, the brand pays the creator directly. CIRCLE does not process payments in v1.', 10, true),
('00000000-0000-4000-8000-000000000002', 'Getting started', 'Who can join?',
 'Creators, influencers, freelancers, and service providers — photographers, videographers, script writers, editors, models, studio floors, podcast setups, and others — plus brands. One account can be a creator and a service provider. Brand accounts are separate.', 20, true),
('00000000-0000-4000-8000-000000000003', 'Getting started', 'Can I join if I''m under 18?',
 'You can take part in the community. You cannot apply to collabs. Collabs require an 18+ confirmation and a date of birth. v1 does not support verifiable parental consent for minors under India''s DPDP Act.', 30, true),
('00000000-0000-4000-8000-000000000004', 'Safety & verification', 'How do I get verified?',
 'Verification uses a code you place in your bio. CIRCLE does not use the Instagram API for this, and it never asks for a social media password. Follower counts stay labelled self-reported until a reviewer confirms the number they see.', 40, true),
('00000000-0000-4000-8000-000000000005', 'Collabs & bids', 'How do fixed, open-bid and barter collabs work?',
 E'Fixed: a brand posts a requirement and a budget in INR. Creators apply. The brand accepts one or more people.\n\nOpen bid: creators send a bid amount and a pitch. The brand picks.\n\nBarter: a product or service in exchange for content. No cash.\n\nAd disclosure (#ad / #collab) is on by default, in line with ASCI influencer guidelines. Brands see a creator''s rates only when that creator has made them visible.', 50, true),
('00000000-0000-4000-8000-000000000006', 'Collabs & bids', 'Does CIRCLE handle payments?',
 'No. In v1 the brand pays the creator directly. CIRCLE records the agreement and the completion. It does not hold funds.', 60, true),
('00000000-0000-4000-8000-000000000007', 'Points & badges', 'How are points and leaderboards calculated?',
 'Points come only from verified events: completed collabs, events you attended, and tasks an admin has approved. Logins, likes, and other raw activity do not earn points. Leaderboards are monthly, for creators and for brands.', 70, true),
('00000000-0000-4000-8000-000000000008', 'Safety & verification', 'How do I report a fake profile or scam collab?',
 'Use the Report button on the profile, service, collab, or application. CIRCLE reviews reports and can remove fake listings, fake collabs, and fraud. For anything else, use the contact form and choose Report a problem.', 80, true),
('00000000-0000-4000-8000-000000000009', 'Events & learning', 'Are webinars and bootcamps free?',
 'Yes. Learning on CIRCLE is free. Sessions cover AI tools, earning from home, becoming a content creator, and doing collabs.', 90, true),
('00000000-0000-4000-8000-000000000010', 'Brands', 'How do brands post a collab?',
 'A brand posts a requirement as a fixed budget, an open bid, or a barter. Creators apply or bid. The brand accepts. Payment, when there is any, goes directly from the brand to the creator.', 100, true),
('00000000-0000-4000-8000-000000000011', 'Brands', 'What paid services do Portfolix Media and Portfolix Tech offer?',
 'These are lead-capture services, separate from free membership. For brands: influencer marketing, influencer negotiation, social media marketing, ad campaigns and ad management, ad video production, and UGC content. For creators: profile audit and optimisation, and social media management (collabs, messages, posting, growth). CIRCLE never asks for or stores a social media password. Prices are quoted separately and are not listed on the site.', 110, true),
('00000000-0000-4000-8000-000000000012', 'Account & privacy', 'How do I delete my account?',
 'Account deletion from settings is not on the site yet. Email info@circlecommunity.in from the address on your account and ask for deletion. Do not send a social media password.', 120, true);
