-- Run in Supabase → SQL Editor (once per project).
-- Netlify functions use SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.

create table if not exists public.portfolio_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  browser text,
  device text,
  os text,
  screen text,
  referrer text,
  lang text,
  timezone text,
  country text,
  city text,
  region text,
  isp text
);

create table if not exists public.portfolio_contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  subject text,
  message text not null
);

alter table public.portfolio_visits enable row level security;
alter table public.portfolio_contacts enable row level security;
