-- Projector Bach audition intake setup.
-- Run this in the Supabase SQL editor for the project connected to Vercel.

create table if not exists public.auditions (
  id uuid primary key default gen_random_uuid(),
  audition_type text not null check (audition_type in ('upload', 'link')),
  audition_url text,
  audition_storage_path text,
  name text not null,
  email text not null,
  phone text,
  instrument text not null,
  musical_taste text not null,
  availability text not null,
  location text,
  message text,
  created_at timestamptz not null default now(),
  constraint audition_source_required check (
    (audition_type = 'upload' and audition_storage_path is not null)
    or
    (audition_type = 'link' and audition_url is not null)
  )
);

alter table public.auditions enable row level security;

-- No anon/authenticated table policies are created on purpose.
-- The Next.js API uses SUPABASE_SERVICE_ROLE_KEY server-side for inserts,
-- and the public API cannot read rows without an explicit future policy.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'auditions',
  'auditions',
  false,
  104857600,
  array[
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/mp4',
    'audio/aac',
    'video/mp4',
    'video/quicktime',
    'video/webm'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
