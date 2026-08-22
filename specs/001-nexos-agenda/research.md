# Phase 0 Research: NEXOS Agenda

## 1. Cliente Supabase en Next.js App Router

- **Decision**: Usar `@supabase/ssr` para crear dos fábricas de cliente — una para
  Server Components/Server Actions/Route Handlers (basada en cookies de la petición) y otra
  para Client Components (`createBrowserClient`).
- **Rationale**: Es el paquete oficialmente soportado por Supabase para App Router; maneja el
  refresco de sesión vía cookies de forma correcta con Server Components y Server Actions.
- **Alternatives considered**: `@supabase/auth-helpers-nextjs` (predecesor, marcado como
  deprecado por Supabase); cliente único compartido cliente/servidor (rechazado: mezcla la
  gestión de cookies de servidor con el contexto de navegador y complica RLS).

## 2. Representación de `category` en la base de datos

- **Decision**: `category` como `VARCHAR(50)` con un `CHECK` constraint que restringe los
  valores a las 8 cadenas fijas (`'General'`, `'Deportes - Fútbol'`, `'Deportes - Vóley'`,
  `'Deportes - Básquet'`, `'Edición'`, `'Mercadeo'`, `'RRPP'`, `'Talento Humano (DH)'`), en
  vez de un `ENUM` de PostgreSQL.
- **Rationale**: Un `ENUM` requiere `ALTER TYPE ... ADD VALUE` (bloqueante y no siempre
  reversible en una misma transacción) si el grupo agrega o renombra una categoría en el
  futuro; un `CHECK` se reemplaza con una migración simple (`ALTER TABLE ... DROP CONSTRAINT
  ... ADD CONSTRAINT ...`). El orden de presentación no vive en la base de datos de todas
  formas — vive en `/lib/categories.ts` (Principio II) — así que el tipo de columna solo
  necesita garantizar valores válidos.
- **Alternatives considered**: `ENUM` (rechazado por el costo de migración futura); tabla
  `categories` separada con FK (rechazado por sobre-ingeniería para 8 valores fijos que no
  cambian por usuario — violaría Principio V, Simplicidad).

## 3. Regla "género solo aplica a Fútbol"

- **Decision**: Reforzar la regla en dos capas: (a) `CHECK (category = 'Deportes - Fútbol' OR
  gender = 'no_aplica')` a nivel de base de datos, y (b) `/lib/categories.ts` expone
  `genderAppliesTo(category): boolean`, consumido tanto por el formulario admin (para
  habilitar/deshabilitar el selector) como por los filtros públicos.
- **Rationale**: La capa de base de datos es la última línea de defensa (Principio III/V);
  la capa de UI evita que el directivo vea un campo que no tiene sentido. Ninguna de las dos
  capas duplica la lista de categorías — ambas llaman a la misma función.
- **Alternatives considered**: Solo validación en frontend (rechazado: no protege contra
  escritura directa a la API/Server Action); trigger de PostgreSQL en vez de `CHECK`
  (rechazado: un `CHECK` declarativo es suficiente para esta regla y más simple de auditar).

## 4. Countdown en tiempo real

- **Decision**: El Server Component de la página pública calcula el próximo evento futuro y
  pasa su `start_time` (ISO string) como prop a un Client Component `<Countdown />`, que corre
  un `setInterval` de 1s en el navegador para actualizar horas:minutos:segundos.
- **Rationale**: No requiere infraestructura adicional (websockets, polling al servidor);
  el cálculo pesado (elegir el próximo evento) ocurre una vez en el servidor.
- **Alternatives considered**: Polling a una API cada segundo (rechazado: gasto innecesario
  de cuota gratuita de Supabase/Vercel); Server-Sent Events (rechazado: complejidad
  injustificada para un contador que solo depende del reloj del cliente).

## 5. Testing

- **Decision**: Vitest para pruebas unitarias de `/lib/categories.ts` y `/lib/validators.ts`
  (incluyendo los casos de la regla género-Fútbol); Playwright para E2E de los flujos
  descritos en User Story 1 y 2 del spec (countdown, filtros, modal, login, CRUD).
- **Rationale**: Ambos son gratuitos/open-source, se integran bien con TypeScript y App
  Router, y corren en GitHub Actions sin costo (dentro del límite gratuito de minutos de CI).
- **Alternatives considered**: Jest (más fricción de configuración con ESM/App Router);
  Cypress (rechazado frente a Playwright por soporte multi-navegador y paralelismo gratuito
  en CI).

## 6. Aprovisionamiento de las 6 cuentas directivas

- **Decision**: Las cuentas se crean manualmente desde el dashboard de Supabase Auth (o con
  un script de seed de un solo uso que use `SUPABASE_SERVICE_ROLE_KEY` localmente, nunca en
  Vercel). No existe pantalla pública de registro.
- **Rationale**: Consistente con FR-011/FR-012 del spec y con la Constitución (sin flujo de
  auto-registro); six cuentas es un volumen trivial para gestión manual.
- **Alternatives considered**: Flujo de invitación por correo vía Supabase Auth (viable a
  futuro, pero fuera de alcance del spec 001 — se deja como posible feature siguiente).

**Output**: Todos los `NEEDS CLARIFICATION` del Technical Context quedan resueltos por las
decisiones anteriores.
