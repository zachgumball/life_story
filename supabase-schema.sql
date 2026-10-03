-- Run this once in Supabase SQL Editor.
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  date text not null,
  location text not null,
  category text not null check (category in ('Travel', 'Reflection', 'Journey')),
  blurb text not null,
  description text not null,
  image text not null,
  highlights jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.journal_entries
  add column if not exists checkpoint_summaries jsonb not null default '[]'::jsonb;

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date text not null,
  location text not null,
  description text not null,
  image text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.journal_entries enable row level security;
alter table public.plans enable row level security;
alter table public.gallery_items enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public can read published journals" on public.journal_entries;
drop policy if exists "Public can read plans" on public.plans;
drop policy if exists "Public can read gallery" on public.gallery_items;
drop policy if exists "Public can read site settings" on public.site_settings;
drop policy if exists "Only owner can create journals" on public.journal_entries;
drop policy if exists "Only owner can update journals" on public.journal_entries;
drop policy if exists "Only owner can delete journals" on public.journal_entries;
drop policy if exists "Only owner can manage plans" on public.plans;
drop policy if exists "Only owner can manage gallery" on public.gallery_items;
drop policy if exists "Only owner can manage site settings" on public.site_settings;

create policy "Public can read published journals"
  on public.journal_entries for select
  using (true);

create policy "Public can read plans"
  on public.plans for select
  using (true);

create policy "Public can read gallery"
  on public.gallery_items for select
  using (true);

create policy "Public can read site settings"
  on public.site_settings for select
  using (true);

-- Replace this email before running the policy.
create policy "Only owner can create journals"
  on public.journal_entries for insert
  to authenticated
  with check ((auth.jwt() ->> 'email') = 'harryzynext@gmail.com');

create policy "Only owner can update journals"
  on public.journal_entries for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'harryzynext@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'harryzynext@gmail.com');

create policy "Only owner can delete journals"
  on public.journal_entries for delete
  to authenticated
  using ((auth.jwt() ->> 'email') = 'harryzynext@gmail.com');

create policy "Only owner can manage plans"
  on public.plans for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'harryzynext@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'harryzynext@gmail.com');

create policy "Only owner can manage gallery"
  on public.gallery_items for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'harryzynext@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'harryzynext@gmail.com');

create policy "Only owner can manage site settings"
  on public.site_settings for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'harryzynext@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'harryzynext@gmail.com');
