-- ============================================================
-- Compakt — Sprint 2: profiles, events, audit_logs
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- 1) profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'dj'
    check (role in ('owner','admin','support','accountant','assistant','dj')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- 2) Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'dj'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists (safe for re-runs)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  dj_id uuid not null references auth.users(id),
  token text unique not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.events enable row level security;

-- 4) audit_logs table
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  target_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.audit_logs enable row level security;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- profiles: users can read/update their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- profiles: staff can read all profiles
create policy "Staff can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('owner','admin','support','accountant','assistant')
    )
  );

-- events: DJ can CRUD own events
create policy "DJ can read own events"
  on public.events for select
  using (auth.uid() = dj_id);

create policy "DJ can insert own events"
  on public.events for insert
  with check (auth.uid() = dj_id);

create policy "DJ can update own events"
  on public.events for update
  using (auth.uid() = dj_id)
  with check (auth.uid() = dj_id);

-- events: staff can read all events
create policy "Staff can read all events"
  on public.events for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('owner','admin','support')
    )
  );

-- audit_logs: staff can read
create policy "Staff can read audit logs"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('owner','admin')
    )
  );

-- audit_logs: insert via service role only (no user insert policy)

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_events_dj_id on public.events(dj_id, created_at desc);
create index if not exists idx_events_token on public.events(token);
create index if not exists idx_audit_logs_actor on public.audit_logs(actor_id, created_at desc);
