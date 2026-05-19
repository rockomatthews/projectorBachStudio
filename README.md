# Projector Bach Recruitment Site

A loud one-page audition intake site for Projector Bach, the masked Electric
Metal band in Park City, Utah.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add these values to `.env.local` and to the Vercel project:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The service role key must stay server-only. Do not rename it with a
`NEXT_PUBLIC_` prefix. The anon key is safe to expose and is used only with
short-lived signed upload tokens.

## Supabase Setup

Run [`supabase/auditions.sql`](supabase/auditions.sql) in the Supabase SQL
editor. It creates:

- `public.auditions` for form metadata
- a private `auditions` storage bucket for uploaded audition media
- RLS on the table with no public read policies

## Audio

Place the looping track at:

```text
public/audio/projector-bach.mp3
```

The site references it as `/audio/projector-bach.mp3`.
