# LibFlow Database Setup & Supabase Migration

Follow these quick steps to set up your Supabase database for LibFlow:

## 1. Create a Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Click **New Project** and choose your preferred organization and database region.
3. Save your database password securely.

## 2. Apply Migration
1. Go to the **SQL Editor** tab in your Supabase dashboard.
2. Open the file [`supabase/migrations/20250101000000_create_books_table.sql`](./migrations/20250101000000_create_books_table.sql).
3. Copy its contents, paste them into the SQL Editor, and click **Run**.
4. The `books` table is now created with RLS enabled, indexes, triggers, and secure policies.

## 3. Retrieve API Credentials
1. Go to **Project Settings** -> **API**.
2. Copy your **Project URL** and paste it as `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`.
3. Copy your **anon / public key** and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.

## 4. Enable Email Authentication
1. Go to **Authentication** -> **Providers** -> **Email**.
2. Ensure Email provider is enabled.
3. (Optional for local testing) You can disable "Confirm email" in Auth settings to allow instant login without verifying email inbox during development.
