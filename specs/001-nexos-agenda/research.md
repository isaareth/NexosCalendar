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

## 7. Tipografía e identidad visual editorial (Principio VI)

- **Decision**: Usar un pairing tipográfico editorial (serif de display para
  titulares/masthead, ej. Google Fonts "Playfair Display" o "Lora" — cargadas vía
  `next/font/google`, sin CDN externo — + una sans-serif neutra y cálida para cuerpo de
  texto, ej. "Source Sans 3"). shadcn/ui se re-temátiza (radios más orgánicos, sin sombras
  tipo "card" de dashboard, sin fuente monospace por defecto) en vez de usarse con su
  configuración por defecto.
- **Rationale**: shadcn/ui "de fábrica" (Inter + esquinas rectas + sombras sutiles) lee como
  un dashboard SaaS genérico, justo lo que el Principio VI prohíbe. Una serif de titular
  evoca un periódico/masthead sin requerir ilustración custom cara de mantener.
- **Alternatives considered**: Fuente "tech" tipo Space Grotesk/JetBrains Mono (rechazada,
  es la estética que se quiere evitar); diseño 100% custom sin shadcn/ui (rechazado, viola
  Principio V — reinventar componentes accesibles desde cero no se justifica).

## 8. Paleta de colores por categoría

- **Decision**: Los 4 colores de departamento son fijos y ya están dados por NEXOS (DH =
  verde, Edición = azul, Mercadeo = morado, RRPP = rojo). `General` se resolvió por
  extracción manual (muestreo de color, no un pipeline automatizado) sobre
  `public/brand/logo-nexos.jpg`. Las tres subcategorías deportivas (`Deportes - Fútbol`,
  `Deportes - Vóley`, `Deportes - Básquet`) comparten un único escudo real —
  `public/brand/deportes.png` — confirmado por NEXOS como el mismo para las tres
  disciplinas, así que comparten también el mismo color extraído de ese escudo. No quedan
  `NEEDS ASSET` pendientes para esta feature.
- **Rationale**: Automatizar la extracción de color de una imagen (k-means sobre píxeles,
  etc.) es una dependencia y un paso de build extra para un valor que se define una sola vez
  y casi no cambia — violaría Principio V (Simplicidad). Un muestreo puntual sobre el PNG/JPG
  real es suficiente y más confiable que inventar un hex de memoria.
- **Colisión detectada y resuelta**: el escudo real de Fútbol es morado/lavanda
  (`#73528E`/`#E4BEFC`), y Mercadeo también es morado por instrucción explícita — ambos son
  morados "reales" (uno heredado de un escudo de 1987, el otro un color de departamento
  fijo) y no se pueden fusionar ni reasignar; se diferencian por temperatura de tono (Fútbol
  = morado-azulado/lavanda, Mercadeo = morado-rojizo/magenta) más FR-019 (el color nunca es
  la única señal). Lo que sí se ajustó: la v1 usaba morado para la etiqueta de género
  "Masculino", lo que habría sumado un tercer uso de morado — se movió a turquesa
  (`#2DD4BF`), tomado del propio acento del logo oficial de NEXOS (el triángulo dentro de la
  "O"), en vez de inventar un color ajeno a la marca.
- **`logo-nexos-creativo.jpg`** (versión artística del logo, fondo negro, tonos tierra:
  verde salvia, ladrillo, arena) se trata como asset **decorativo**, no como fuente de color
  de categoría — informa en cambio la paleta secundaria "editorial cálida" (fondos tipo
  papel, grises cálidos) que refuerza el Principio VI en vez de un blanco/gris frío de
  dashboard.
- **Alternatives considered**: Extracción automática de paleta (ej. `node-vibrant`) —
  rechazada por sobre-ingeniería; reutilizar el mismo morado para género y Mercadeo
  (rechazado, aumenta la ambigüedad justo donde el usuario pidió coherencia); un color
  distinto por disciplina deportiva (rechazado — no hay tres escudos distintos, hay uno solo
  compartido; inventar variaciones sería un color no respaldado por ningún asset real).

> **Nota**: la tabla original de este apartado asignaba un único color (el del escudo de
> Fútbol) a las 3 subcategorías deportivas. Esa decisión se **revisó en §9** a pedido del
> usuario: Vóley y Básquet ahora tienen color propio, y Fútbol se diferencia por género en
> los lugares donde se muestra un evento concreto.

| Categoría / uso | Color | Hex | Fuente |
|---|---|---|---|
| Talento Humano (DH) | Verde | `#16A34A` | Instrucción explícita del usuario |
| Edición | Azul | `#2563EB` | Instrucción explícita del usuario |
| Mercadeo | Morado (rojizo/magenta) | `#9333EA` | Instrucción explícita + ajustado para distinguirse de Deportes |
| RRPP | Rojo | `#DC2626` | Instrucción explícita del usuario |
| General | Azul marino | `#234090` | Extraído de `public/brand/logo-nexos.jpg` |
| Deportes - Fútbol / Vóley / Básquet | Morado (azulado/lavanda) | `#73528E` (tinte claro `#E4BEFC`) | Extraído de `public/brand/deportes.png` (mismo escudo para las 3 disciplinas) |
| Género — Masculino | Turquesa | `#2DD4BF` | Acento del logo oficial (`logo-nexos.jpg`), reemplaza el morado de v1 para evitar la colisión |
| Género — Femenino | Rosado/coral | `#F472B6` | Sin cambios respecto a v1, sin colisión |

## 9. Revisión: color por género en Fútbol + colores propios para Vóley/Básquet

- **Decision**: Se introduce `eventColor(event)` en `lib/theme.ts`, que calcula el color de
  un evento concreto: si `category = 'Deportes - Fútbol'`, usa `GENDER_COLOR[gender]`
  (rosado para femenino, aguamarina/turquesa para masculino) en vez de un color de
  categoría fijo; para el resto de categorías (incluyendo Vóley y Básquet, que ahora tienen
  color propio: amarillo `#CA8A04` y naranja `#EA580C`) usa `CATEGORY_COLOR[category]` sin
  cambios. `CATEGORY_COLOR['Deportes - Fútbol']` (el morado del escudo) se conserva para los
  lugares donde solo se conoce la categoría, no un evento (el chip de Fútbol en `Filters`).
  También se agrega `eventColorForeground(event)`, porque el amarillo de Vóley no tiene
  contraste suficiente con texto blanco — usa texto oscuro solo para esa categoría.
- **Rationale**: Petición explícita del usuario tras ver la previsualización del calendario:
  quiere distinguir partidos de niñas/niños por color (no solo por texto), y que Vóley/Básquet
  dejen de compartir el morado de Fútbol. `eventColor`/`eventColorForeground` son la única
  fuente de este cálculo (Principio II/VI) — `CalendarView`, `EventModal` y `Ticker` lo
  consumen; ninguno reimplementa la condición "Fútbol + género".
- **Alternatives considered**: Agregar `masculino`/`femenino` como si fueran categorías
  separadas (rechazado — el modelo de datos ya trata género como un campo aparte de
  categoría, y duplicarlo como categoría rompería `CATEGORY_ORDER`/FR-004); mantener un solo
  color por categoría e ignorar la distinción de género en el calendario (rechazado, es
  exactamente lo que el usuario pidió cambiar).

## 10. Animación de entrada: portada de periódico

- **Decision**: La animación de entrada de la vista pública (FR-021) se implementa como dos
  paneles en `rotateY` (efecto "portada abriéndose", con `perspective` en el contenedor) que
  muestran `public/brand/logo-nexos-creativo.jpg` mientras están cerrados, y se abren
  (~2.2s) revelando la página real ya renderizada detrás. Reemplaza un diseño anterior
  (zoom-out + rotación hacia la esquina) que no evocaba la identidad de periódico tan
  directamente.
- **Rationale**: Es 100% CSS (keyframes + `transform-origin` + `perspective`), sin
  dependencias nuevas (Principio V), y usa el asset que ya se había clasificado como
  "decorativo" en §8 — aquí encuentra un uso funcional legítimo (la portada del splash) sin
  convertirse en fuente de color de categoría, que sigue siendo su rol según §8.
- **Alternatives considered**: Librería de animación (Framer Motion/GSAP) — rechazada,
  innecesaria para dos transiciones CSS; animar el logo oficial en vez del creativo
  (rechazado, el usuario pidió específicamente el logo creativo para este momento).

**Output**: Todos los `NEEDS CLARIFICATION` del Technical Context quedan resueltos. No
quedan `NEEDS ASSET` pendientes.
