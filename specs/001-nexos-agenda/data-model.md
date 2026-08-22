# Phase 1 Data Model: NEXOS Agenda

## Entity: Event (`events`)

Corresponde a "Actividad" en el spec (FR-001 a FR-010, FR-014).

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | `uuid`, PK | `DEFAULT gen_random_uuid()` |
| `title` | `varchar(255)` | Requerido, no vacío (FR-014) |
| `description` | `text` | Opcional |
| `extra_info` | `text` | Opcional (FR-009) |
| `category` | `varchar(50)` | Requerido; uno de los 8 valores fijos (ver `/lib/categories.ts`); orden de presentación NO vive aquí (FR-004) |
| `gender` | `sports_gender` (`masculino`\|`femenino`\|`no_aplica`) | `DEFAULT 'no_aplica'`; solo puede ser distinto de `no_aplica` si `category = 'Deportes - Fútbol'` (FR-005) |
| `character` | `event_character` (`obligatorio`\|`voluntario`) | Requerido, sin default silencioso — el formulario debe forzar una elección (FR-007) |
| `start_time` | `timestamptz` | Requerido (FR-014); determina el "próximo evento" del countdown (FR-002) |
| `end_time` | `timestamptz` | Opcional; si está presente, `end_time >= start_time` |
| `location` | `varchar(255)` | Requerido (FR-014) |
| `result` | `varchar(100)` | Opcional, texto libre (FR-010) |
| `created_at` / `updated_at` | `timestamptz` | `DEFAULT now()`; `updated_at` se actualiza en cada UPDATE |

**Constraints derivados de las reglas de negocio**:

```sql
CHECK (category IN (
  'General',
  'Deportes - Fútbol', 'Deportes - Vóley', 'Deportes - Básquet',
  'Edición', 'Mercadeo', 'RRPP', 'Talento Humano (DH)'
))

CHECK (category = 'Deportes - Fútbol' OR gender = 'no_aplica')

CHECK (end_time IS NULL OR end_time >= start_time)
```

**No hay máquina de estados**: un Event no transiciona entre estados explícitos; `result`
simplemente se llena o no, y `start_time` en el pasado es válido (edge case del spec: registrar
actividades ya ocurridas).

## Entity: Directive User

Representado íntegramente por `auth.users` de Supabase Auth — **no se crea tabla propia**
(decisión de Research §6 y Assumption del spec: cualquier directivo autenticado puede
gestionar actividades de cualquier categoría, por lo que no hace falta una tabla de mapeo
área → usuario en el alcance de este spec).

| Atributo | Origen |
|---|---|
| `id`, `email` | `auth.users` (Supabase Auth) |
| Sesión | Cookie gestionada por `@supabase/ssr` |
| Permisos | Implícitos: cualquier fila de `auth.users` (`authenticated`) tiene acceso de escritura completo vía la policy RLS `"Escritura protegida para directivos"` |

## Domain module: `/lib/categories.ts` (no es una tabla, es la fuente única de la regla)

```ts
export const CATEGORY_ORDER = [
  "General",
  "Deportes - Fútbol",
  "Deportes - Vóley",
  "Deportes - Básquet",
  "Edición",
  "Mercadeo",
  "RRPP",
  "Talento Humano (DH)",
] as const;

export type Category = (typeof CATEGORY_ORDER)[number];

export function genderAppliesTo(category: Category): boolean {
  return category === "Deportes - Fútbol";
}
```

Todo componente (filtros públicos, formulario admin, seed scripts) importa `CATEGORY_ORDER`
y `genderAppliesTo` en vez de redefinir la lista o la condición — esto es lo que hace
verificable a SC-005 y SC-002 del spec.

## Design tokens: `/lib/theme.ts` (no es una tabla, es la fuente única del color por categoría)

Implementa FR-018/FR-019 y la Constitución Principio VI. Valores concretos y su
justificación están en [research.md §8](research.md#8-paleta-de-colores-por-categoría) y
[§9](research.md#9-revisión-color-por-género-en-fútbol--colores-propios-para-vóleybásquet).

```ts
export const CATEGORY_COLOR: Record<Category, string> = {
  "General": "#234090",              // extraído de public/brand/logo-nexos.jpg
  "Deportes - Fútbol": "#73528E",    // color de categoría "puro" (sin género conocido) — chip de Filters
  "Deportes - Vóley": "#CA8A04",     // amarillo — a pedido del usuario
  "Deportes - Básquet": "#EA580C",   // naranja — a pedido del usuario
  "Edición": "#2563EB",
  "Mercadeo": "#9333EA",
  "RRPP": "#DC2626",
  "Talento Humano (DH)": "#16A34A",
};

export const GENDER_COLOR = {
  masculino: "#2DD4BF",              // aguamarina — acento del logo oficial
  femenino: "#F472B6",               // rosado
} as const;

// Color de una actividad concreta: en Fútbol usa GENDER_COLOR (rosado/aguamarina) en vez
// del morado de categoría, para distinguir partidos de niñas/niños en el calendario.
export function eventColor(event: { category: Category; gender: EventGender }): string;

// Blanco no contrasta bien sobre el amarillo de Vóley — texto legible por categoría.
export function eventColorForeground(event: { category: Category; gender: EventGender }): string;
```

Ningún componente define un color de categoría o de género fuera de este archivo (mismo
principio de fuente única que `/lib/categories.ts`, aplicado a diseño en vez de a datos).
`CalendarView`, `EventModal` y `Ticker` (que renderizan eventos concretos) usan
`eventColor`/`eventColorForeground`; `Filters` (que renderiza categorías sin un evento
concreto) usa `CATEGORY_COLOR` directamente.
