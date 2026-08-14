-- Row Level Security.
--
-- Default posture: everything is denied until a policy allows it. Anonymous
-- visitors can read approved cafes and nothing else; contributing requires an
-- account; changing approved data requires a moderator.

alter table public.profiles      enable row level security;
alter table public.cafes         enable row level security;
alter table public.cafe_edits    enable row level security;
alter table public.cafe_reviews  enable row level security;
alter table public.comments      enable row level security;
alter table public.reports       enable row level security;

-- ------------------------------------------------------------- helpers

-- SECURITY DEFINER is load-bearing, not incidental. A policy on `profiles`
-- that queries `profiles` to find the caller's role re-triggers the same
-- policy and recurses forever. Running the lookup as the definer bypasses RLS
-- for this one narrow read and breaks the cycle.
create or replace function public.is_moderator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and role in ('moderator', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke execute on function public.is_moderator() from public;
revoke execute on function public.is_admin() from public;
grant execute on function public.is_moderator() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- ------------------------------------------------------------ profiles

create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "users update their own profile"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "admins update any profile"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- A WITH CHECK cannot see the previous row, so it cannot express "role must
-- not have changed". This trigger can, and it is the only thing standing
-- between a normal user and self-promotion to admin.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'only an admin may change a role';
  end if;
  return new;
end;
$$;

create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- --------------------------------------------------------------- cafes

create policy "approved cafes are public"
  on public.cafes for select
  using (status = 'approved');

create policy "authors see their own submissions"
  on public.cafes for select
  to authenticated
  using (created_by = (select auth.uid()));

create policy "moderators see everything"
  on public.cafes for select
  to authenticated
  using (public.is_moderator());

-- Submissions always land as 'pending' and always attributed to the caller.
-- Both are enforced here rather than trusted from the client.
create policy "signed-in users submit cafes"
  on public.cafes for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and status = 'pending'
  );

create policy "moderators update cafes"
  on public.cafes for update
  to authenticated
  using (public.is_moderator())
  with check (public.is_moderator());

create policy "admins delete cafes"
  on public.cafes for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------- cafe edits

create policy "authors see their own edits"
  on public.cafe_edits for select
  to authenticated
  using (created_by = (select auth.uid()));

create policy "moderators see all edits"
  on public.cafe_edits for select
  to authenticated
  using (public.is_moderator());

create policy "signed-in users suggest edits"
  on public.cafe_edits for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and status = 'pending'
  );

create policy "moderators resolve edits"
  on public.cafe_edits for update
  to authenticated
  using (public.is_moderator())
  with check (public.is_moderator());

-- ------------------------------------------------------------- reviews

-- Reviews of a pending cafe stay invisible until the cafe itself is approved,
-- so an unapproved submission cannot be used to publish arbitrary text.
create policy "reviews of approved cafes are public"
  on public.cafe_reviews for select
  using (
    exists (
      select 1 from public.cafes c
      where c.id = cafe_id and c.status = 'approved'
    )
  );

create policy "signed-in users review approved cafes"
  on public.cafe_reviews for insert
  to authenticated
  with check (
    author_id = (select auth.uid())
    and exists (
      select 1 from public.cafes c
      where c.id = cafe_id and c.status = 'approved'
    )
  );

create policy "authors edit their own review"
  on public.cafe_reviews for update
  to authenticated
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));

create policy "authors delete their own review"
  on public.cafe_reviews for delete
  to authenticated
  using (author_id = (select auth.uid()) or public.is_moderator());

-- ------------------------------------------------------------ comments

create policy "visible comments are public"
  on public.comments for select
  using (not hidden);

create policy "authors see their own hidden comments"
  on public.comments for select
  to authenticated
  using (author_id = (select auth.uid()) or public.is_moderator());

create policy "signed-in users comment"
  on public.comments for insert
  to authenticated
  with check (author_id = (select auth.uid()) and not hidden);

create policy "authors edit their own comment"
  on public.comments for update
  to authenticated
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));

create policy "moderators moderate comments"
  on public.comments for update
  to authenticated
  using (public.is_moderator())
  with check (public.is_moderator());

create policy "authors and moderators delete comments"
  on public.comments for delete
  to authenticated
  using (author_id = (select auth.uid()) or public.is_moderator());

-- ------------------------------------------------------------- reports

-- Deliberately write-only for ordinary users: you can report something, but
-- you cannot enumerate what everyone else has reported.
create policy "signed-in users file reports"
  on public.reports for insert
  to authenticated
  with check (reporter_id = (select auth.uid()));

create policy "moderators read reports"
  on public.reports for select
  to authenticated
  using (public.is_moderator());

create policy "moderators resolve reports"
  on public.reports for update
  to authenticated
  using (public.is_moderator())
  with check (public.is_moderator());
