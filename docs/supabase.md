# Supabase Setup — Daily Planner

The Todo / Daily Planner feature (`/todo`) uses Supabase for user authentication and task storage. Without it, the app falls back to `localStorage` and skips auth.

---

## Environment Variables

Add these to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
```

Both values are found in your Supabase project under **Settings → API**.

If the variables are missing or start with `your_`, the Supabase client returns `null` and the app runs in local-only mode (no auth, tasks stored in browser only).

---

## Database Schema

Create a `tasks` table in your Supabase project (**SQL Editor → New query**):

```sql
create table tasks (
  id           text primary key,
  user_id      uuid references auth.users(id) on delete cascade,
  text         text not null,
  completed    boolean not null default false,
  scheduled_date text not null,   -- YYYY-MM-DD
  sort_order   integer not null default 0
);

-- Row-level security: users only see their own tasks
alter table tasks enable row level security;

create policy "Users manage own tasks"
  on tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

---

## Auth Configuration

In the Supabase dashboard under **Authentication → Providers**, enable **Email** (on by default). Two options:

| Setting | Effect |
|---|---|
| Email confirmations **on** (default) | User gets a confirmation email before they can sign in |
| Email confirmations **off** | Account is active immediately after sign up |

For development, turning confirmations off is easier.

---

## How It Works

| File | Role |
|---|---|
| `lib/supabase.ts` | Creates the Supabase client; exports `null` if env vars are missing |
| `components/AuthGate.tsx` | Handles sign-in / sign-up form and session state; renders `TodoPage` once authenticated |
| `components/TodoPage.tsx` | Task UI — reads from Supabase on mount, writes on every change; falls back to `localStorage` |
| `app/todo/page.tsx` | Route entry point — just renders `<AuthGate />` |

Data flow: `localStorage` loads instantly on mount for a fast first paint, then Supabase replaces it once fetched. All writes go to both simultaneously.

---

## Local Dev Without Supabase

Leave the env vars unset (or omit `.env.local` entirely). The app will skip auth and use `localStorage` only. The "Synced" indicator will not appear.
