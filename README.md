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
5. `/speckit-implement` — ejecuta las tareas y genera el código (hecho — ver "Estado actual")

Cualquier cambio de alcance o de regla de negocio se hace primero en el spec/constitución
correspondiente, no directamente en el código (Constitución, Principio V).

## Stack (100% free tier)

- **Framework**: Next.js 16 (App Router, Server Actions, Turbopack)
- **UI**: Tailwind CSS v4 (CSS-first, sin `tailwind.config.ts`) + shadcn/ui re-tematizado +
  Lucide Icons + tipografía editorial (Playfair Display + Source Sans 3, vía
  `next/font/google`)
- **Datos y auth**: Supabase (PostgreSQL + Supabase Auth + RLS)
- **Testing**: Vitest (unidad) + Playwright (E2E)
- **Hosting**: Vercel (app) + Supabase Cloud (datos/auth)

Detalle completo de decisiones técnicas en
[specs/001-nexos-agenda/research.md](specs/001-nexos-agenda/research.md).

## Estado actual

- [x] Constitución del proyecto (v1.1.0 — incluye identidad editorial, Principio VI)
- [x] Spec de la feature `001-nexos-agenda` (vista pública + panel admin)
- [x] Plan técnico, modelo de datos, contratos y guía de quickstart
- [x] Desglose en tareas (`tasks.md`)
- [x] Implementación (`/speckit-implement`) — código de la vista pública y el panel admin
      generado; build, lint, type-check y pruebas unitarias en verde
- [ ] Aplicar `supabase/schema.sql` a un proyecto Supabase real (tarea T010 — requiere una
      cuenta Supabase, ver Setup local)
- [ ] Despliegue a Vercel + Supabase (tarea T042)

## Setup local

```bash
npm install
cp .env.example .env.local
```

Completa `.env.local` con las credenciales de un proyecto Supabase real (gratis en
[supabase.com](https://supabase.com)), y aplica [supabase/schema.sql](supabase/schema.sql)
desde el SQL Editor del dashboard. Luego crea las 6 cuentas directivas siguiendo
[scripts/seed-directors.md](scripts/seed-directors.md).

```bash
npm run dev          # http://localhost:3000
npm run lint
npm test              # Vitest
npm run test:e2e      # Playwright (requiere el dev server y datos de prueba)
npm run build
```

Sin credenciales reales de Supabase, `/admin/login` renderiza correctamente pero `/`
mostrará un error al intentar cargar actividades — es el comportamiento esperado, no un bug
(ver [quickstart.md](specs/001-nexos-agenda/quickstart.md) para los escenarios completos de
validación).
