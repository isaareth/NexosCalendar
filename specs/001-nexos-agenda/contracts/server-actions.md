# Contracts: Server Actions & Auth (NEXOS Agenda)

No hay una API REST/GraphQL separada — el "contrato" del sistema son las Server Actions de
Next.js que el panel admin invoca, más las queries de solo-lectura que usa la vista pública.
Todas viven en `app/admin/dashboard/actions.ts` salvo donde se indique.

## Lectura pública (Server Components, sin Server Action — SELECT directo vía Supabase)

```ts
listEvents(filters?: {
  category?: Category;      // uno de CATEGORY_ORDER
  gender?: "masculino" | "femenino"; // solo válido si category === "Deportes - Fútbol"
  character?: "obligatorio" | "voluntario";
}): Promise<Event[]>

getNextEvent(): Promise<Event | null>
// El evento futuro (start_time > now()) más cercano, de cualquier categoría (FR-002).
```

Ambas se ejecutan con el cliente Supabase "anon" (RLS: lectura pública sin autenticación).

## Escritura (Server Actions, requieren sesión `authenticated`)

```ts
type EventInput = {
  title: string;               // requerido
  description?: string;
  extra_info?: string;
  category: Category;          // requerido, uno de CATEGORY_ORDER
  gender?: "masculino" | "femenino"; // solo si genderAppliesTo(category); si no, se fuerza "no_aplica"
  character: "obligatorio" | "voluntario"; // requerido
  start_time: string;          // ISO 8601, requerido
  end_time?: string;           // ISO 8601, >= start_time si está presente
  location: string;            // requerido
  result?: string;
};

createEvent(input: EventInput): Promise<{ data: Event } | { error: string }>
updateEvent(id: string, input: EventInput): Promise<{ data: Event } | { error: string }>
deleteEvent(id: string): Promise<{ success: true } | { error: string }>
```

**Reglas de contrato**:
- Las tres funciones re-validan `EventInput` con `/lib/validators.ts` en el servidor
  (nunca confían solo en la validación del formulario) — cumple FR-016.
- Si no hay sesión válida, Supabase RLS rechaza el `INSERT`/`UPDATE`/`DELETE` y la Server
  Action devuelve `{ error: "No autorizado" }` sin filtrar detalles internos.
- `gender` se normaliza a `"no_aplica"` en el servidor si `!genderAppliesTo(input.category)`,
  incluso si el cliente envía otro valor (defensa en profundidad de FR-005).

## Auth (Supabase Auth, vía `/lib/supabase/server.ts`)

```ts
signIn(email: string, password: string): Promise<{ success: true } | { error: string }>
signOut(): Promise<void>
```

`signIn` con credenciales inválidas devuelve un `error` genérico ("Credenciales inválidas"),
sin distinguir si el correo existe (FR-012, acceptance scenario de User Story 2).

## Middleware contract (`proxy.ts` — convención Next.js 16, antes `middleware.ts`)

- Intercepta cualquier ruta bajo `/admin` excepto `/admin/login`.
- Si no hay sesión Supabase válida en las cookies de la petición → `redirect("/admin/login")`.
- No aplica a rutas públicas (`/`, assets).
