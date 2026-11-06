-- Rode no Supabase: SQL Editor > New query > Run.
-- Pré-requisito: a conta anthonyacbb22@gmail.com já deve ter sido criada pelo site (Criar conta).
-- Pode rodar várias vezes sem erro.

create table if not exists public.masters (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.masters enable row level security;

create or replace function public.is_master() returns boolean
language sql security definer set search_path = public stable as
$$ select exists (select 1 from public.masters where user_id = auth.uid()) $$;
grant execute on function public.is_master() to authenticated;

-- acesso total às fichas: ver, editar e excluir
drop policy if exists "mestre ve tudo" on public.characters;
create policy "mestre ve tudo" on public.characters for select to authenticated using (public.is_master());
drop policy if exists "mestre edita tudo" on public.characters;
create policy "mestre edita tudo" on public.characters for update to authenticated
  using (public.is_master()) with check (public.is_master());
drop policy if exists "mestre exclui tudo" on public.characters;
create policy "mestre exclui tudo" on public.characters for delete to authenticated using (public.is_master());

-- e-mail dos jogadores visível para o mestre
drop policy if exists "perfil proprio ou mestre" on public.profiles;
create policy "perfil proprio ou mestre" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_master());

-- define o mestre
insert into public.masters (user_id)
select id from auth.users where email = 'anthonyacbb22@gmail.com'
on conflict do nothing;

-- conferência: deve devolver 1 linha com o e-mail do mestre
select u.email, m.user_id from public.masters m join auth.users u on u.id = m.user_id;
