# NEXOS Agenda (v2)

Reconstrucción del calendario de actividades de NEXOS sobre Next.js + Supabase, desarrollada
con **spec-driven development (SDD)** vía [GitHub Spec Kit](https://github.com/github/spec-kit).
La v1 (HTML/CSS/JS vanilla + Node/Express/SQLite) sigue viva en la raíz del repositorio
[`NexosFC`](https://github.com/isaareth/NexosFC); esta carpeta es un proyecto/repositorio
independiente.

## Qué es spec-driven development aquí

El código no se escribe primero: cada feature pasa por una cadena de documentos versionados
en `specs/<feature>/` que son la fuente de verdad, y el código se genera *a partir* de ellos.

```
.specify/memory/constitution.md   Principios no negociables del proyecto (por qué se hacen las cosas así)
specs/001-nexos-agenda/
├── spec.md            QUÉ construir y POR QUÉ (sin stack técnico) — historias de usuario, requisitos, criterios de éxito
├── plan.md            CÓMO construirlo — stack, arquitectura, estructura de carpetas, chequeo contra la constitución
├── research.md        Decisiones técnicas puntuales con su justificación y alternativas descartadas
├── data-model.md       Entidades, campos, reglas de validación
├── contracts/          Firmas de Server Actions / contratos de interfaz
├── quickstart.md        Cómo correr el proyecto y qué escenarios validan el spec
└── tasks.md             Lista de tareas ejecutables, ordenadas por dependencia y por historia de usuario
```

Flujo seguido (Spec Kit, vía skills de Claude Code en `.claude/skills/`):

1. `/speckit-constitution` — define los principios del proyecto (ya hecho, ver
   [.specify/memory/constitution.md](.specify/memory/constitution.md))
2. `/speckit-specify` — describe una feature en términos de negocio (ver
   [specs/001-nexos-agenda/spec.md](specs/001-nexos-agenda/spec.md))
3. `/speckit-plan` — decide el stack y la arquitectura para esa feature (ver
   [specs/001-nexos-agenda/plan.md](specs/001-nexos-agenda/plan.md))
4. `/speckit-tasks` — desglosa el plan en tareas ejecutables (ver
   [specs/001-nexos-agenda/tasks.md](specs/001-nexos-agenda/tasks.md))
5. `/speckit-implement` — ejecuta las tareas y genera el código (pendiente — no se ha
   ejecutado todavía)

Cualquier cambio de alcance o de regla de negocio se hace primero en el spec/constitución
correspondiente, no directamente en el código (Constitución, Principio V).

## Stack (100% free tier)

- **Framework**: Next.js 14+ (App Router, Server Actions)
- **UI**: Tailwind CSS + shadcn/ui + Lucide Icons
- **Datos y auth**: Supabase (PostgreSQL + Supabase Auth + RLS)
- **Hosting**: Vercel (app) + Supabase Cloud (datos/auth)

Detalle completo de decisiones técnicas en
[specs/001-nexos-agenda/research.md](specs/001-nexos-agenda/research.md).

## Estado actual

- [x] Constitución del proyecto
- [x] Spec de la feature `001-nexos-agenda` (vista pública + panel admin)
- [x] Plan técnico, modelo de datos, contratos y guía de quickstart
- [x] Desglose en tareas (`tasks.md`)
- [ ] Implementación (`/speckit-implement`) — próximo paso
- [ ] Despliegue a Vercel + Supabase

Ver [specs/001-nexos-agenda/quickstart.md](specs/001-nexos-agenda/quickstart.md) para los
pasos de setup local una vez exista código.
