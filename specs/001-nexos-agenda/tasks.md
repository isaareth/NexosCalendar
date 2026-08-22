# Tasks: NEXOS Agenda — Calendario Público y Panel Administrativo

**Input**: Design documents from `/specs/001-nexos-agenda/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/server-actions.md](contracts/server-actions.md),
[quickstart.md](quickstart.md)

**Tests**: Incluidos — `plan.md` ya comprometió Vitest + Playwright como stack de testing
(Research §5), así que las tareas de test forman parte del flujo, no son opcionales.

**Organization**: Las tareas se agrupan por historia de usuario (US1 = vista pública, P1;
US2 = panel admin, P2) para que cada una sea implementable y verificable de forma
independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Se puede ejecutar en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: A qué historia de usuario pertenece (US1, US2)

## Phase 1: Setup

**Purpose**: Inicializar el proyecto Next.js y sus herramientas base.

- [ ] T001 Crear el proyecto Next.js 14+ (App Router, TypeScript estricto) en la raíz del
      repositorio con `create-next-app`
- [ ] T002 [P] Configurar Tailwind CSS (`tailwind.config.ts`, `app/globals.css`)
- [ ] T003 [P] Inicializar shadcn/ui e instalar los componentes base (`button`, `dialog`,
      `select`, `input`, `badge`, `card`) en `components/ui/`
- [ ] T004 [P] Instalar dependencias de Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- [ ] T005 [P] Configurar ESLint + Prettier con reglas de TypeScript estricto
- [ ] T006 [P] Crear `.env.example` con `NEXT_PUBLIC_SUPABASE_URL`,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] T007 [P] Configurar Vitest (`vitest.config.ts`) y Playwright (`playwright.config.ts`)

**Checkpoint**: Proyecto arranca con `npm run dev` sirviendo una página en blanco.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura compartida que TODAS las historias de usuario necesitan.

**⚠️ CRITICAL**: Ninguna historia de usuario empieza antes de completar esta fase.

- [ ] T008 Escribir `supabase/schema.sql` con la tabla `events`, los tipos `event_character` /
      `sports_gender`, los `CHECK` constraints y las políticas RLS descritas en
      [data-model.md](data-model.md)
- [ ] T009 Aplicar `supabase/schema.sql` al proyecto Supabase (SQL Editor del dashboard o
      `supabase db push`) y confirmar que RLS queda habilitado
- [ ] T010 [P] Crear `lib/categories.ts` con `CATEGORY_ORDER` y `genderAppliesTo()` (fuente
      única de la Constitución, Principio II)
- [ ] T011 [P] Crear `lib/types.ts` con los tipos `Event` y `EventInput` compartidos
- [ ] T012 [P] Crear `lib/validators.ts` con la validación de `EventInput` (reutiliza
      `lib/categories.ts` para la regla género-Fútbol; no la reimplementa)
- [ ] T013 [P] Crear `lib/supabase/server.ts` (cliente Supabase para Server
      Components/Actions vía `@supabase/ssr`, basado en cookies)
- [ ] T014 [P] Crear `lib/supabase/client.ts` (cliente Supabase para Client Components)
- [ ] T015 Crear `middleware.ts` que protege todo bajo `/admin` excepto `/admin/login`,
      redirigiendo a login si no hay sesión válida (depende de T013)

**Checkpoint**: Base de datos, tipos, validación y clientes Supabase listos — las historias
de usuario pueden empezar.

---

## Phase 3: User Story 1 - Visitante consulta el calendario público (Priority: P1) 🎯 MVP

**Goal**: Cualquier visitante sin sesión puede ver el countdown al próximo evento, navegar el
calendario, filtrar por categoría/género/carácter y abrir el detalle de una actividad.

**Independent Test**: Cargar la vista pública sin ninguna cuenta y validar los escenarios 1-7
de User Story 1 en [spec.md](spec.md), usando los pasos de
[quickstart.md](quickstart.md#escenarios-de-validación-trazan-a-acceptance-scenarios-del-spec).

### Tests for User Story 1

- [ ] T016 [P] [US1] Test unitario de `CATEGORY_ORDER`/`genderAppliesTo` en
      `tests/unit/categories.test.ts` (incluye el caso "Fútbol habilita género, el resto no")
- [ ] T017 [P] [US1] Test E2E Playwright del flujo público (countdown, filtros, modal) en
      `tests/e2e/public-view.spec.ts`

### Implementation for User Story 1

- [ ] T018 [US1] Implementar `listEvents(filters)` y `getNextEvent()` en `lib/queries.ts`
      usando el cliente Supabase de servidor (depende de T013)
- [ ] T019 [P] [US1] Componente `Countdown` (Client Component) en
      `app/(public)/components/Countdown.tsx` — recibe `start_time` como prop y actualiza
      HH:MM:SS cada segundo, con estado vacío si no hay próximo evento
- [ ] T020 [P] [US1] Componente `CalendarView` (Client Component, vistas mensual/semanal) en
      `app/(public)/components/CalendarView.tsx`
- [ ] T021 [P] [US1] Componente `Filters` (categoría/género/carácter) en
      `app/(public)/components/Filters.tsx`, importando el orden y la regla desde
      `lib/categories.ts` (no debe redefinir la lista)
- [ ] T022 [P] [US1] Componente `EventModal` en `app/(public)/components/EventModal.tsx`
      (título, fecha/hora, lugar, carácter, descripción, `extra_info`, `result`)
- [ ] T023 [P] [US1] Componente `CharacterBadge` (insignia obligatorio/voluntario) en
      `app/(public)/components/CharacterBadge.tsx`
- [ ] T024 [US1] Ensamblar `app/page.tsx` como Server Component: obtiene próximo evento y
      lista filtrable, renderiza Countdown/CalendarView/Filters/EventModal (depende de
      T018-T023)
- [ ] T025 [US1] Aplicar estilos responsivos (desktop/tablet/móvil) con Tailwind a los
      componentes públicos

**Checkpoint**: User Story 1 funciona de punta a punta de forma independiente — se puede
hacer demo del calendario público sin que exista todavía el panel admin.

---

## Phase 4: User Story 2 - Directivo publica y mantiene actividades (Priority: P2)

**Goal**: Un directivo autenticado gestiona el CRUD completo de actividades desde un panel
protegido, con el formulario adaptando el campo género según la categoría.

**Independent Test**: Iniciar sesión con una credencial directiva de prueba y ejecutar el
ciclo crear → editar → eliminar, verificando en cada paso el reflejo en la vista pública
(escenarios 1-8 de User Story 2 en [spec.md](spec.md)).

### Tests for User Story 2

- [ ] T026 [P] [US2] Test unitario de `lib/validators.ts` en `tests/unit/validators.test.ts`
      (incluye: carácter requerido, normalización server-side de `gender` a `no_aplica`
      fuera de Fútbol, `end_time >= start_time`)
- [ ] T027 [P] [US2] Test E2E Playwright de login + CRUD en `tests/e2e/admin-crud.spec.ts`
      (incluye el intento de acceso a `/admin/dashboard` sin sesión)

### Implementation for User Story 2

- [ ] T028 [US2] Página `app/admin/login/page.tsx` con formulario email/password
- [ ] T029 [US2] Server Actions `signIn`/`signOut` en `app/admin/login/actions.ts`, usando
      `lib/supabase/server.ts`, con mensaje de error genérico en credenciales inválidas
- [ ] T030 [US2] Página `app/admin/dashboard/page.tsx` (Server Component autenticado) que
      lista actividades con acciones editar/eliminar
- [ ] T031 [US2] Componente `EventForm` (Client Component) en
      `app/admin/dashboard/components/EventForm.tsx`: campo género visible solo si
      `genderAppliesTo(category)` (vía `lib/categories.ts`), carácter obligatorio sin default
- [ ] T032 [US2] Server Actions `createEvent`/`updateEvent`/`deleteEvent` en
      `app/admin/dashboard/actions.ts` según [contracts/server-actions.md](contracts/server-actions.md):
      re-validan con `lib/validators.ts` y normalizan `gender` en el servidor (depende de
      T012, T013)
- [ ] T033 [US2] Conectar `EventForm` y la lista del dashboard a las Server Actions
      (crear/editar/eliminar) con `revalidatePath` sobre `/` tras cada mutación
- [ ] T034 [US2] Agregar estados de error/vacío y diálogo de confirmación de borrado en el
      dashboard

**Checkpoint**: User Story 1 y 2 funcionan juntas — publicar desde el panel se refleja en la
vista pública sin pasos manuales.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Cierre de la primera versión completa.

- [ ] T035 [P] Script/documentación de aprovisionamiento de las 6 cuentas directivas en
      `scripts/seed-directors.md` (pasos manuales en Supabase Auth, según Research §6)
- [ ] T036 [P] `README.md` del proyecto (setup, arquitectura, flujo spec-driven usado)
- [ ] T037 Ejecutar manualmente los 7 escenarios de validación de
      [quickstart.md](quickstart.md) de punta a punta
- [ ] T038 [P] Pasada de accesibilidad básica (labels, foco visible, contraste) en vistas
      pública y admin
- [ ] T039 Desplegar a Vercel (free tier), conectar variables de entorno del proyecto
      Supabase, y confirmar que `SUPABASE_SERVICE_ROLE_KEY` NO está configurada en Vercel

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias — puede iniciar de inmediato
- **Foundational (Phase 2)**: depende de Setup — BLOQUEA ambas historias de usuario
- **User Story 1 (Phase 3)**: depende solo de Foundational
- **User Story 2 (Phase 4)**: depende solo de Foundational — es independiente de US1 en
  código, aunque para demostrar el ciclo completo (crear en admin → verlo en público) ambas
  deben estar desplegadas
- **Polish (Phase 5)**: depende de que las historias que se vayan a entregar estén completas

### Parallel Opportunities

- T002-T007 (Setup) en paralelo
- T010-T014 (Foundational, archivos distintos) en paralelo; T015 depende de T013
- Una vez cerrada la Fase 2: **US1 completa (Fase 3) y US2 completa (Fase 4) se pueden
  trabajar en paralelo** por dos personas distintas, ya que no comparten archivos de
  implementación (solo comparten `lib/categories.ts` y `lib/validators.ts`, ya creados en
  Foundational)
- Dentro de US1: T019-T023 en paralelo; T024 depende de todos ellos y de T018
- Dentro de US2: T028 y T031 en paralelo; T032 depende de T012/T013; T033 depende de T031 y
  T032

---

## Parallel Example: User Story 1

```bash
# Tras completar Foundational, lanzar en paralelo:
Task: "Componente Countdown en app/(public)/components/Countdown.tsx"
Task: "Componente CalendarView en app/(public)/components/CalendarView.tsx"
Task: "Componente Filters en app/(public)/components/Filters.tsx"
Task: "Componente EventModal en app/(public)/components/EventModal.tsx"
Task: "Componente CharacterBadge en app/(public)/components/CharacterBadge.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 solamente)

1. Completar Fase 1: Setup
2. Completar Fase 2: Foundational (bloqueante)
3. Completar Fase 3: User Story 1
4. **PARAR Y VALIDAR**: probar la vista pública de forma independiente (con datos cargados
   manualmente en Supabase, sin panel admin todavía)
5. Desplegar/mostrar si está listo — ya es un calendario público funcional, aunque sin CRUD

### Entrega incremental

1. Setup + Foundational → base lista
2. Agregar User Story 1 → validar independientemente → demo (MVP)
3. Agregar User Story 2 → validar independientemente → demo (producto completo: contenido
   se administra sin tocar código, igual que pedía el objetivo original del proyecto)
4. Fase de Polish → aprovisionar directivos reales y desplegar a producción

---

## Notes

- [P] = archivos distintos, sin dependencias pendientes entre sí
- [US1]/[US2] mapean cada tarea a su historia de usuario para trazabilidad hacia
  [spec.md](spec.md)
- Cada Server Action de escritura (T032) DEBE revalidar con `lib/validators.ts` en el
  servidor — no basta con la validación del formulario (FR-016)
- Confirmar tras cada tarea que no se reintrodujo una segunda copia de `CATEGORY_ORDER` o de
  la condición "solo Fútbol tiene género" en otro archivo (viola Principio II)
