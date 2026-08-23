-- NEXOS Agenda — schema.sql
-- Fuente de verdad de la base de datos. Ver specs/001-nexos-agenda/data-model.md.
-- Pegar en el SQL Editor de Supabase, o aplicar con `supabase db push`.

create extension if not exists "pgcrypto";

create type event_character as enum ('obligatorio', 'voluntario');
create type sports_gender as enum ('masculino', 'femenino', 'no_aplica');
create type sports_outcome as enum ('ganado', 'perdido', 'empate');

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  description text,
  extra_info text,
  category varchar(50) not null,
  gender sports_gender not null default 'no_aplica',
  character event_character not null,
  start_time timestamptz not null,
  end_time timestamptz,
  location varchar(255) not null,
  result varchar(100),
  outcome sports_outcome,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint events_category_valid check (category in (
    'General',
    'Deportes - Fútbol', 'Deportes - Vóley', 'Deportes - Básquet',
    'Edición', 'Mercadeo', 'RRPP', 'Talento Humano (DH)'
  )),

  -- Regla de negocio (spec 001-nexos-agenda FR-005): género solo aplica a Fútbol.
  constraint events_gender_only_futbol check (
    category = 'Deportes - Fútbol' or gender = 'no_aplica'
  ),

  -- Regla de negocio (FR-023): "ganado/perdido/empate" solo aplica a categorías deportivas.
  constraint events_outcome_only_sports check (
    category like 'Deportes - %' or outcome is null
  ),

  constraint events_end_after_start check (
    end_time is null or end_time >= start_time
  )
);

create index if not exists events_start_time_idx on events (start_time);
create index if not exists events_category_idx on events (category);

-- Mantiene updated_at al día en cada UPDATE.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists events_set_updated_at on events;
create trigger events_set_updated_at
  before update on events
  for each row
  execute function set_updated_at();

-- Row Level Security (Constitución Principio III)
alter table events enable row level security;

drop policy if exists "Lectura pública de eventos" on events;
create policy "Lectura pública de eventos"
  on events for select
  using (true);

drop policy if exists "Escritura protegida para directivos" on events;
create policy "Escritura protegida para directivos"
  on events for all
  to authenticated
  using (true)
  with check (true);
