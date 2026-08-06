# ClearBank application

React/Vite application deployed on Vercel with Supabase Auth, Postgres and Storage.

## Local configuration

Create `.env.local` with:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Development

```bash
npm install
npm run dev
```

## Database and access policies

Run `supabase/migrations/20260804_initial_schema.sql` in the Supabase SQL Editor before deploying the migration. Setup instructions are in `supabase/README.md`.
