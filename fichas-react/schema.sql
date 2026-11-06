-- Pode rodar quantas vezes quiser: não dá erro se a tabela já existir.
create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  theme text not null check (theme in ('ghoul','ccg','humano')),
  name text not null default 'Novo personagem',
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create index if not exists characters_owner_updated_idx on public.characters (owner, updated_at desc);
alter table public.characters enable row level security;
drop policy if exists "dono acessa seus personagens" on public.characters;
create policy "dono acessa seus personagens" on public.characters
  for all to authenticated
  using (owner = auth.uid()) with check (owner = auth.uid());

-- ============ MESTRE: acesso a todas as fichas ============
create table if not exists public.masters (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.masters enable row level security;  -- sem policies: ninguém lê direto, só pela função abaixo

create or replace function public.is_master() returns boolean
language sql security definer set search_path = public stable as
$$ select exists (select 1 from public.masters where user_id = auth.uid()) $$;
grant execute on function public.is_master() to authenticated;

-- mestre vê, edita e exclui todas as fichas
drop policy if exists "mestre ve tudo" on public.characters;
create policy "mestre ve tudo" on public.characters for select to authenticated using (public.is_master());
drop policy if exists "mestre edita tudo" on public.characters;
create policy "mestre edita tudo" on public.characters for update to authenticated
  using (public.is_master()) with check (public.is_master());

drop policy if exists "mestre exclui tudo" on public.characters;
create policy "mestre exclui tudo" on public.characters for delete to authenticated using (public.is_master());

-- perfis (e-mail de cada jogador) para o mestre saber de quem é cada ficha
create table if not exists public.profiles (id uuid primary key references auth.users(id) on delete cascade, email text);
alter table public.profiles enable row level security;
drop policy if exists "perfil proprio ou mestre" on public.profiles;
create policy "perfil proprio ou mestre" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_master());

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as
$$ begin insert into public.profiles (id, email) values (new.id, new.email) on conflict do nothing; return new; end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
insert into public.profiles (id, email) select id, email from auth.users on conflict do nothing;  -- usuários já existentes

-- TORNAR ALGUÉM MESTRE (troque o e-mail e rode):
insert into public.masters (user_id) select id from auth.users where email = 'anthonyacbb22@gmail.com' on conflict do nothing;  -- a conta precisa já existir
