# Supabase setup

The migrations here are complete and ready to apply. They need a Supabase
project, which only you can create — it requires your account credentials.

## One-time setup

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
   The free tier is enough for this.

2. Install the CLI and sign in:

   ```fish
   npm install -g supabase
   supabase login
   ```

3. Link this repo to the project (the ref is in your project's URL):

   ```fish
   cd ~/Claude/Coffee
   supabase link --project-ref <your-project-ref>
   ```

4. Apply the migrations:

   ```fish
   supabase db push
   ```

5. Copy `.env.example` to `.env.local` and fill in the URL and anon key from
   **Project Settings → API**.

The anon key is safe in a client bundle — Row Level Security is what protects
the data, not key secrecy. Never put the `service_role` key in `.env.local`.

## Making yourself an admin

Every new signup gets `role = 'user'`. Promote yourself once, from the SQL
editor in the dashboard:

```sql
update public.profiles set role = 'admin' where id = auth.uid();
```

That statement runs as the dashboard's privileged connection, which bypasses
the role guard trigger. From the app, only an existing admin can change roles.

## What the policies actually enforce

| Who | Can |
|---|---|
| Anonymous | Read approved cafes, visible comments, reviews of approved cafes |
| Signed in | Submit cafes (forced to `pending`, attributed to them), suggest edits, review approved cafes, comment, file reports |
| Moderator | See and resolve the queue, edit cafes, hide comments, read reports |
| Admin | Everything, plus deleting cafes and changing roles |

Two details worth knowing, because both are easy to get wrong:

- **`is_admin()` / `is_moderator()` are `SECURITY DEFINER`.** A policy on
  `profiles` that queries `profiles` to find the caller's role re-triggers
  itself and recurses forever. Running that one lookup as the definer breaks
  the cycle.
- **Role escalation is blocked by a trigger, not a policy.** A `WITH CHECK`
  clause cannot see the previous row, so it cannot express "role must not have
  changed". `guard_profile_role()` can.

## Verifying it works

Do this against the live project before trusting it — RLS is not something to
assume. From the SQL editor:

```sql
-- Should return nothing: anonymous users must not see pending cafes.
set role anon;
select count(*) from public.cafes where status = 'pending';
reset role;
```

And from the app with an ordinary signed-in account, confirm that updating
someone else's cafe row fails, and that setting your own `role` to `'admin'`
raises `only an admin may change a role`.
