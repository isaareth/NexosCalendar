-- Migración: agrega "outcome" (ganado/perdido/empate) para partidos ya jugados.
-- Para un proyecto Supabase que YA tiene la tabla `events` de schema.sql — pégala una vez
-- en el SQL Editor. Un proyecto nuevo no la necesita: ya viene incluida en schema.sql.

do $$ begin
  create type sports_outcome as enum ('ganado', 'perdido', 'empate');
exception when duplicate_object then null;
end $$;

alter table events add column if not exists outcome sports_outcome;

alter table events drop constraint if exists events_outcome_only_sports;
alter table events add constraint events_outcome_only_sports
  check (category like 'Deportes - %' or outcome is null);
