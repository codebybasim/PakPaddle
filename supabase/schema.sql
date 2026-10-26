-- ============================================================
-- PakPadel Database Schema
-- Run this in Supabase SQL Editor → New Query
-- ============================================================

-- ── 1. PROFILES ─────────────────────────────────────────────
-- Extends auth.users with app-specific profile data.
-- Automatically created when a user signs up via trigger.

create table if not exists public.profiles (
  id              uuid        primary key references auth.users(id) on delete cascade,
  full_name       text,
  avatar_url      text,
  phone           text,
  city            text,
  skill_level     text        check (skill_level in ('beginner','intermediate','advanced','pro')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Row Level Security: users can only read/update their own profile
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-insert a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── 2. VENUES ────────────────────────────────────────────────
-- Padel clubs / facilities that own courts.

create table if not exists public.venues (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  description     text,
  address         text        not null,
  city            text        not null,
  latitude        double precision,
  longitude       double precision,
  phone           text,
  email           text,
  website         text,
  image_url       text,
  amenities       text[]      default '{}',   -- e.g. {'parking','cafe','showers'}
  is_active       boolean     not null default true,
  created_at      timestamptz not null default now()
);

alter table public.venues enable row level security;

-- Everyone can read active venues
create policy "Public can view active venues"
  on public.venues for select
  using (is_active = true);


-- ── 3. COURTS ────────────────────────────────────────────────
-- Individual padel courts belonging to a venue.

create table if not exists public.courts (
  id              uuid        primary key default gen_random_uuid(),
  venue_id        uuid        not null references public.venues(id) on delete cascade,
  name            text        not null,           -- e.g. "Court 1", "Glass Court"
  surface         text        check (surface in ('artificial_grass','concrete','glass')),
  is_indoor       boolean     not null default false,
  is_active       boolean     not null default true,
  hourly_rate     numeric(10,2) not null default 0,
  currency        text        not null default 'PKR',
  image_url       text,
  created_at      timestamptz not null default now()
);

alter table public.courts enable row level security;

create policy "Public can view active courts"
  on public.courts for select
  using (is_active = true);


-- ── 4. BOOKINGS ──────────────────────────────────────────────
-- Court booking slots.

-- Enable the btree_gist extension required for the overlap constraint
create extension if not exists btree_gist;

create table if not exists public.bookings (
  id              uuid        primary key default gen_random_uuid(),
  court_id        uuid        not null references public.courts(id) on delete restrict,
  user_id         uuid        not null references auth.users(id) on delete cascade,
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  duration_hours  numeric(4,2) not null,
  total_price     numeric(10,2) not null,
  currency        text        not null default 'PKR',
  status          text        not null default 'pending'
                              check (status in ('pending','confirmed','cancelled','completed')),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Prevent double-booking the same court for overlapping times
  constraint no_overlap exclude using gist (
    court_id with =,
    tstzrange(starts_at, ends_at) with &&
  )
);

alter table public.bookings enable row level security;

create policy "Users can view own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can cancel own bookings"
  on public.bookings for update
  using (auth.uid() = user_id);


-- ── 5. SUBSCRIPTIONS ─────────────────────────────────────────
-- Mirrors RevenueCat entitlements locally for fast server-side checks.
-- RevenueCat webhooks should keep this in sync.

create table if not exists public.subscriptions (
  id                    uuid        primary key default gen_random_uuid(),
  user_id               uuid        not null references auth.users(id) on delete cascade,
  revenuecat_user_id    text        unique,
  product_id            text,                    -- e.g. 'pakpadel_pro_monthly'
  entitlement           text,                    -- e.g. 'pro'
  is_active             boolean     not null default false,
  platform              text        check (platform in ('ios','android','web')),
  expires_at            timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);


-- ── 6. UPDATED_AT TRIGGER ────────────────────────────────────
-- Keeps updated_at current on any table that has it.

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger set_bookings_updated_at
  before update on public.bookings
  for each row execute procedure public.set_updated_at();

create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.set_updated_at();


-- ── 7. USEFUL INDEXES ────────────────────────────────────────

create index if not exists idx_courts_venue       on public.courts(venue_id);
create index if not exists idx_bookings_user      on public.bookings(user_id);
create index if not exists idx_bookings_court     on public.bookings(court_id);
create index if not exists idx_bookings_starts    on public.bookings(starts_at);
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);


-- ── 8. SEED — example venues + courts ────────────────────────
-- Delete or comment out this section if you don't want sample data.

insert into public.venues (name, address, city, latitude, longitude, amenities) values
  ('Islamabad Padel Club', 'F-7 Markaz, Islamabad', 'Islamabad', 33.7294, 73.0931, array['parking','cafe','changing_rooms']),
  ('Lahore Sports Arena',  'DHA Phase 5, Lahore',   'Lahore',    31.4697, 74.4074, array['parking','showers'])
on conflict do nothing;

insert into public.courts (venue_id, name, surface, is_indoor, hourly_rate)
select id, 'Court 1', 'artificial_grass', false, 2500
from public.venues where name = 'Islamabad Padel Club'
on conflict do nothing;

insert into public.courts (venue_id, name, surface, is_indoor, hourly_rate)
select id, 'Court 2', 'glass', true, 3500
from public.venues where name = 'Islamabad Padel Club'
on conflict do nothing;

insert into public.courts (venue_id, name, surface, is_indoor, hourly_rate)
select id, 'Court 1', 'artificial_grass', false, 2000
from public.venues where name = 'Lahore Sports Arena'
on conflict do nothing;


-- ── 9. BACKFILL existing auth users into profiles ────────────
-- Run this once if you already have users in auth.users
-- who were created before the trigger existed.

insert into public.profiles (id, full_name, avatar_url)
select
  id,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'avatar_url'
from auth.users
on conflict (id) do nothing;
