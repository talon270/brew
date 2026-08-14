-- Brew — community cafe data.
--
-- Only genuinely community-owned data lives here. Editorial content (the
-- guide, grinder catalogue, bean catalogue) stays in git: it needs version
-- history and an author's voice, not a moderation queue.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- enums

create type public.cafe_status as enum ('pending', 'approved', 'rejected');

create type public.brew_method as enum (
  'espresso',
  'pourover',
  'aeropress',
  'french_press',
  'moka',
  'south_indian_filter'
);

create type public.roast_profile as enum ('light', 'medium', 'dark', 'mixed');

create type public.price_band as enum ('budget', 'mid', 'premium');

create type public.user_role as enum ('user', 'moderator', 'admin');

-- -------------------------------------------------------------- profiles

-- Mirrors auth.users so we can attach a role and a display name without
-- granting anyone access to the auth schema.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) between 1 and 60),
  role public.user_role not null default 'user',
  created_at timestamptz not null default now()
);

comment on table public.profiles is
  'Public-facing user record. Role drives moderation permissions.';

-- Create a profile automatically on signup, so no client code can forget to.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------- cafes

create table public.cafes (
  id uuid primary key default gen_random_uuid(),

  name text not null check (char_length(name) between 2 and 120),
  -- Free text rather than an enum: NCR neighbourhoods are contested and
  -- constantly renamed, and an enum would need a migration per new area.
  area text not null check (char_length(area) between 2 and 80),
  address text,
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),

  -- The coffee-specific detail that Google Maps does not carry. This is the
  -- entire reason the app exists, so most of it is non-null with a default.
  roaster text,
  roasts_own boolean not null default false,
  brew_methods public.brew_method[] not null default '{}',
  serves_filter_coffee boolean not null default false,
  roast_profile public.roast_profile,
  price_band public.price_band,

  has_seating boolean,
  has_wifi boolean,
  has_outdoor boolean,

  notes text check (char_length(notes) <= 2000),

  status public.cafe_status not null default 'pending',
  created_by uuid references public.profiles (id) on delete set null,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Stops the same cafe being submitted twice in the same area.
create unique index cafes_name_area_key
  on public.cafes (lower(name), lower(area));

create index cafes_status_idx on public.cafes (status);
create index cafes_area_idx on public.cafes (lower(area));
create index cafes_brew_methods_idx on public.cafes using gin (brew_methods);

-- --------------------------------------------------------- cafe edits

-- Suggested changes to an approved cafe. Kept separate from `cafes` so an
-- approved row is never mutated by a stranger before a moderator sees it.
create table public.cafe_edits (
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid not null references public.cafes (id) on delete cascade,
  -- Partial patch; only the keys the submitter wanted to change.
  changes jsonb not null,
  reason text check (char_length(reason) <= 500),
  status public.cafe_status not null default 'pending',
  created_by uuid references public.profiles (id) on delete set null,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index cafe_edits_status_idx on public.cafe_edits (status);
create index cafe_edits_cafe_idx on public.cafe_edits (cafe_id);

-- ------------------------------------------------------------- reviews

create table public.cafe_reviews (
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid not null references public.cafes (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,

  rating smallint not null check (rating between 1 and 5),
  what_you_ordered text check (char_length(what_you_ordered) <= 120),
  body text check (char_length(body) <= 2000),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- One review per person per cafe; they can edit it instead of stacking.
  unique (cafe_id, author_id)
);

create index cafe_reviews_cafe_idx on public.cafe_reviews (cafe_id);

-- ------------------------------------------------------------ comments

-- Comments attach to editorial content that lives in git, so the target is
-- a stable slug rather than a foreign key.
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('guide_section', 'grinder', 'bean')),
  subject_slug text not null check (char_length(subject_slug) between 1 and 120),
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index comments_subject_idx on public.comments (subject_type, subject_slug);

-- ------------------------------------------------------------- reports

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('cafe', 'review', 'comment')),
  subject_id uuid not null,
  reason text not null check (char_length(reason) between 3 and 500),
  reporter_id uuid references public.profiles (id) on delete set null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index reports_unresolved_idx on public.reports (resolved) where not resolved;

-- ------------------------------------------------------- updated_at

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cafes_touch_updated_at
  before update on public.cafes
  for each row execute function public.touch_updated_at();

create trigger cafe_reviews_touch_updated_at
  before update on public.cafe_reviews
  for each row execute function public.touch_updated_at();
