-- Execute this migration in the Supabase SQL Editor before switching production traffic.
create extension if not exists pgcrypto;

create type public.user_role as enum ('client', 'admin');
create type public.request_status as enum ('en_attente', 'approuve', 'refuse');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role public.user_role not null default 'client',
  nom text,
  prenom text,
  created_date timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  nom text not null,
  prenom text not null,
  mail text not null unique,
  iban text default '',
  numero_de_compte text default '',
  numero_de_compte_sequestre text default '',
  reference_dossier_sequestre text default '',
  date_liberation_comite_sequestre date,
  remarque text default '',
  contrat_pdf text,
  derniere_connexion timestamptz,
  signature_acceptee boolean not null default false,
  date_signature timestamptz,
  documents_client text[] not null default '{}',
  compte_valide boolean not null default false,
  created_date timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.demandes_ouverture (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  prenom text not null,
  mail text not null,
  telephone text default '',
  iban text default '',
  motif text default '',
  date_naissance date,
  id_recto_url text,
  id_verso_url text,
  statut public.request_status not null default 'en_attente',
  date_demande timestamptz not null default now(),
  created_date timestamptz not null default now()
);

create table public.demandes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  client_email text not null,
  type text not null check (type in ('liberation_fournisseur', 'recuperation_compte_courant')),
  statut public.request_status not null default 'en_attente',
  montant numeric,
  motif text default '',
  date_demande timestamptz not null default now(),
  created_date timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  client_email text not null,
  montant numeric not null,
  transaction text not null,
  date date not null,
  created_date timestamptz not null default now()
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  prenom text not null,
  nom text not null,
  email text not null,
  entreprise text default '',
  message text not null,
  statut text not null default 'nouveau' check (statut in ('nouveau', 'lu', 'traite')),
  created_date timestamptz not null default now()
);

create table public.login_codes (
  id uuid primary key default gen_random_uuid(),
  client_email text not null,
  code text not null,
  used boolean not null default false,
  created_date timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, nom, prenom)
  values (new.id, new.email, new.raw_user_meta_data ->> 'nom', new.raw_user_meta_data ->> 'prenom')
  on conflict (id) do update set email = excluded.email;
  update public.clients set user_id = new.id where lower(mail) = lower(new.email) and user_id is null;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do update set email = excluded.email;

update public.clients c
set user_id = u.id
from auth.users u
where lower(c.mail) = lower(u.email) and c.user_id is null;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger clients_updated_at before update on public.clients for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.demandes_ouverture enable row level security;
alter table public.demandes enable row level security;
alter table public.transactions enable row level security;
alter table public.contacts enable row level security;
alter table public.login_codes enable row level security;

create policy "profiles read own or admin" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles admin update" on public.profiles for update using (public.is_admin()) with check (public.is_admin());

create policy "clients own or admin read" on public.clients for select using (user_id = auth.uid() or public.is_admin());
create policy "clients admin create" on public.clients for insert with check (public.is_admin());
create policy "clients own limited or admin update" on public.clients for update using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "clients admin delete" on public.clients for delete using (public.is_admin());

create policy "openings public create" on public.demandes_ouverture for insert with check (true);
create policy "openings owner or admin read" on public.demandes_ouverture for select using (lower(mail) = lower(coalesce(auth.jwt() ->> 'email', '')) or public.is_admin());
create policy "openings admin update" on public.demandes_ouverture for update using (public.is_admin()) with check (public.is_admin());
create policy "openings admin delete" on public.demandes_ouverture for delete using (public.is_admin());

create policy "demandes owner or admin read" on public.demandes for select using (lower(client_email) = lower(coalesce(auth.jwt() ->> 'email', '')) or public.is_admin());
create policy "demandes owner or admin create" on public.demandes for insert with check (lower(client_email) = lower(coalesce(auth.jwt() ->> 'email', '')) or public.is_admin());
create policy "demandes admin update" on public.demandes for update using (public.is_admin()) with check (public.is_admin());
create policy "demandes admin delete" on public.demandes for delete using (public.is_admin());

create policy "transactions owner or admin read" on public.transactions for select using (lower(client_email) = lower(coalesce(auth.jwt() ->> 'email', '')) or public.is_admin());
create policy "transactions admin write" on public.transactions for all using (public.is_admin()) with check (public.is_admin());

create policy "contacts public create" on public.contacts for insert with check (true);
create policy "contacts admin read" on public.contacts for select using (public.is_admin());
create policy "contacts admin update" on public.contacts for update using (public.is_admin()) with check (public.is_admin());
create policy "contacts admin delete" on public.contacts for delete using (public.is_admin());

create policy "codes admin access" on public.login_codes for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public) values ('documents', 'documents', false) on conflict (id) do nothing;
create policy "documents authenticated upload" on storage.objects for insert to authenticated with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "documents owner or admin read" on storage.objects for select to authenticated using (bucket_id = 'documents' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
create policy "documents owner or admin delete" on storage.objects for delete to authenticated using (bucket_id = 'documents' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- Promote the intended administrator after that user has registered:
-- update public.profiles set role = 'admin' where email = 'admin@example.com';
