-- Rode no Supabase: SQL Editor > New query
create table public.characters (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  theme text not null check (theme in ('ghoul','ccg','humano')),
  name text not null default 'Novo personagem',
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create index on public.characters (owner, updated_at desc);
alter table public.characters enable row level security;
create policy "dono acessa seus personagens" on public.characters
  for all to authenticated
  using (owner = auth.uid()) with check (owner = auth.uid());
