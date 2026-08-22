# Quickstart: NEXOS Agenda

## Prerrequisitos

- Node.js 18+, npm.
- Una cuenta gratuita en [supabase.com](https://supabase.com) y un proyecto creado (free
  tier).
- Una cuenta gratuita en [vercel.com](https://vercel.com) (solo necesaria para desplegar,
  no para desarrollo local).

## Setup local

```bash
npm install
cp .env.example .env.local
```

Completar `.env.local` con los valores del proyecto Supabase (Project Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # solo para scripts de seed locales, nunca en Vercel/cliente
```

Aplicar el esquema: pegar el contenido de `supabase/schema.sql` en el SQL Editor del
dashboard de Supabase (o `supabase db push` si se usa la CLI de Supabase).

Crear las 6 cuentas directivas desde Authentication → Users en el dashboard de Supabase
(email + password), una por área (General, Deportes, Edición, Mercadeo, RRPP, Talento
Humano), según Research §6.

```bash
npm run dev
```

## Escenarios de validación (trazan a Acceptance Scenarios del spec)

1. **Countdown (US1, escenario 1-2)**: con al menos un evento futuro en `events`, abrir
   `http://localhost:3000` → el contador muestra HH:MM:SS y baja cada segundo. Sin eventos
   futuros, muestra un estado vacío (no un error).
2. **Filtro género solo en Fútbol (US1, escenario 3-4)**: filtrar por "Deportes → Fútbol" →
   aparece el filtro Masculino/Femenino. Filtrar por "Deportes → Vóley" → el filtro de género
   desaparece o se deshabilita.
3. **Orden de categorías (US1, escenario 7)**: abrir cualquier `<select>`/lista de categoría y
   confirmar el orden General → Deportes (Fútbol, Vóley, Básquet) → Edición → Mercadeo → RRPP
   → Talento Humano (DH).
4. **Ruta protegida (US2, escenario 1)**: sin sesión iniciada, ir a `/admin/dashboard` →
   redirige a `/admin/login`.
5. **CRUD + regla de género en el formulario (US2, escenarios 3-5)**: iniciar sesión con una
   cuenta directiva → crear un evento de categoría "Deportes - Fútbol" sin elegir género →
   el formulario bloquea el guardado. Cambiar a "Edición" → el campo género desaparece.
6. **Resultado visible (US2, escenario 6)**: editar un evento pasado agregando `result` →
   verificar que aparece en el modal de detalle de la vista pública.
7. **Escritura no autorizada (US2, escenario 8 / FR-016)**: sin sesión, invocar directamente
   `createEvent`/`updateEvent`/`deleteEvent` (por ejemplo desde la consola del navegador o un
   test) → Supabase RLS rechaza la operación.

## Pruebas automatizadas

```bash
npm run test        # Vitest — lib/categories.ts, lib/validators.ts
npm run test:e2e     # Playwright — flujos completos de US1 y US2
```
