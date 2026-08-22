# Implementation Plan: NEXOS Agenda — Calendario Público y Panel Administrativo

**Branch**: `001-nexos-agenda` | **Date**: 2026-08-22 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-nexos-agenda/spec.md`

## Summary

Reconstruir el calendario de actividades de NEXOS como una aplicación Next.js full-stack
respaldada por Supabase: una vista pública de solo lectura (countdown, calendario, filtros,
modal de detalle) y un panel administrativo protegido por Supabase Auth para el CRUD de
actividades por parte de los 6 directivos. La regla de negocio central (orden fijo de
categorías, género solo para Fútbol, carácter obligatorio) se centraliza en un módulo de
dominio compartido (`/lib/categories.ts`) y en constraints de base de datos, para que la
UI pública y el panel admin nunca puedan divergir en la regla (Constitución, Principio II).

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) sobre Node.js 18+

**Primary Dependencies**: Next.js 14+ (App Router, Server Actions), `@supabase/ssr` +
`@supabase/supabase-js`, Tailwind CSS, shadcn/ui, Lucide Icons, `date-fns` (o `Intl` nativo)
para formateo de fechas.

**Storage**: Supabase PostgreSQL (tabla `events`; usuarios directivos en `auth.users`, nativo
de Supabase Auth — no se crea tabla de usuarios propia).

**Testing**: Vitest (unidad: reglas de negocio de `/lib/categories.ts`, validadores) +
Playwright (E2E: flujo público completo, login + CRUD admin).

**Target Platform**: Web, desplegado en Vercel (Hobby/free tier), Node.js runtime para rutas
que usan Supabase Auth basado en cookies.

**Project Type**: Aplicación web full-stack (Next.js App Router; un solo proyecto, sin
paquete de backend separado).

**Performance Goals**: Interacción fluida en un plan gratuito — countdown actualizado cada
segundo sin llamadas de red adicionales; navegación de calendario y filtros sin recarga
completa de página.

**Constraints**: 100% infraestructura gratuita (Vercel Hobby + Supabase Free tier); sin
dependencias que requieran plan pago; `SUPABASE_SERVICE_ROLE_KEY` nunca expuesta al cliente.

**Scale/Scope**: Un solo grupo estudiantil, ~6 cuentas directivas, tráfico público bajo
(decenas/cientos de visitas por semana), volumen de eventos del orden de decenas por mes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|---|---|---|
| I. Free-Tier First | Vercel Hobby + Supabase Free cubren el uso previsto; ninguna dependencia elegida (Next.js, Supabase, Tailwind, shadcn/ui, Vitest, Playwright) requiere plan pago. | PASS |
| II. Reglas de negocio en un solo lugar | Orden de categorías y regla género-solo-Fútbol viven en `/lib/categories.ts` + un `CHECK` constraint en `events`; tanto la vista pública como el panel admin importan ese módulo. | PASS |
| III. Seguridad por defecto (RLS) | RLS habilitado en `events`; lectura pública, escritura solo `authenticated`; `SUPABASE_SERVICE_ROLE_KEY` restringida a scripts de servidor/seed, nunca a componentes cliente. | PASS |
| IV. Arquitectura server-first tipada | Server Components por defecto; Client Components solo para countdown, calendario interactivo y formularios; TypeScript strict en todo `/app`, `/lib`, `/components`. | PASS |
| V. Simplicidad y fidelidad al spec | Alcance limitado a lo descrito en `spec.md` (001); no se agregan roles, campos ni categorías fuera de las 6 fijas. | PASS |
| VI. Identidad editorial, no estética tech | Paleta y tipografía definidas en `lib/theme.ts`/`tailwind.config.ts` a partir de `public/brand/` + colores fijos por departamento; shadcn/ui re-temado (no se usa su look por defecto); color siempre acompañado de texto (FR-019). | PASS (colores de General/Deportes quedan pendientes de los archivos de logo — no bloquea el resto del plan) |

Sin violaciones. No se requiere la tabla de Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-nexos-agenda/
├── plan.md              # Este archivo
├── research.md          # Fase 0
├── data-model.md        # Fase 1
├── quickstart.md         # Fase 1
├── contracts/
│   └── server-actions.md # Fase 1
└── tasks.md              # Fase 2 (/speckit-tasks, aún no generado)
```

### Source Code (repository root)

```text
app/
├── page.tsx                     # Vista pública (Server Component: countdown + calendario)
├── layout.tsx
├── globals.css
├── (public)/
│   └── components/              # Client Components: Countdown, CalendarView, Filters, EventModal
├── admin/
│   ├── login/
│   │   └── page.tsx             # Formulario de login (Supabase Auth)
│   └── dashboard/
│       ├── page.tsx             # Lista de eventos + acciones CRUD
│       └── actions.ts           # Server Actions: createEvent/updateEvent/deleteEvent
├── middleware.ts                # Protege /admin/* redirigiendo a /admin/login sin sesión

lib/
├── supabase/
│   ├── server.ts                # Cliente Supabase para Server Components/Actions (cookies)
│   └── client.ts                # Cliente Supabase para Client Components
├── categories.ts                # Fuente única: orden de categorías + regla género-Fútbol
├── validators.ts                # Validación compartida de EventInput (reusa categories.ts)
└── theme.ts                     # Fuente única: color por categoría (department colors + brand)

components/
└── ui/                          # Componentes shadcn/ui re-temados (button, dialog, select, ...)

public/
└── brand/                       # Logos oficiales de NEXOS (ver public/brand/README.md):
                                  # logo-nexos.jpg, logo-nexos-creativo.jpg, deportes.png
                                  # (deportes.png es un único escudo para Fútbol/Vóley/Básquet)

supabase/
└── schema.sql                   # DDL + políticas RLS (fuente de verdad de la BD)

tests/
├── unit/                        # Vitest: lib/categories.ts, lib/validators.ts
└── e2e/                         # Playwright: flujo público, login + CRUD admin
```

**Structure Decision**: Proyecto único Next.js App Router (no hay backend separado: las
Server Actions y Route Handlers dentro de `app/` cumplen ese rol). Se usa la carpeta
`supabase/` en la raíz para mantener `schema.sql` como fuente de verdad versionada, replicando
el patrón que ya usa el repo v1 (`backend/database/schema.sql`) pero sin un servidor Express
propio: Supabase reemplaza esa capa.

## Complexity Tracking

Sin violaciones de la Constitución — tabla no aplicable.
