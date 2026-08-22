# Feature Specification: NEXOS Agenda — Calendario Público y Panel Administrativo

**Feature Branch**: `001-nexos-agenda`

**Created**: 2026-08-22

**Status**: Draft

**Input**: User description: "Sistema de calendario de actividades centralizado para el grupo estudiantil NEXOS. Vista pública navegable y filtrable para cualquier visitante, y un panel administrativo protegido para los 6 cargos directivos del grupo (General, Deportes [Fútbol/Vóley/Básquet], Edición, Mercadeo, RRPP, Talento Humano). Cada actividad tiene categoría, carácter obligatorio/voluntario, y — solo para Fútbol — género (masculino/femenino). Countdown al próximo evento, calendario navegable, filtros, modal de detalle, CRUD protegido por login."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitante consulta el calendario público (Priority: P1)

Cualquier persona (estudiante, familiar, hincha) entra al sitio sin iniciar sesión y quiere
saber qué actividad de NEXOS sigue, y qué hay programado esta semana o este mes, opcionalmente
filtrado por área o tipo de actividad.

**Why this priority**: Es la razón de existir del proyecto — un calendario centralizado que
reemplaza mensajes dispersos en chats de grupo. Sin esto no hay producto.

**Independent Test**: Se puede probar por completo sin ninguna cuenta: cargar la página
pública, ver el countdown al próximo evento, navegar el calendario, aplicar filtros y abrir
el detalle de una actividad.

**Acceptance Scenarios**:

1. **Given** existen eventos futuros cargados, **When** un visitante abre la página principal,
   **Then** ve un contador en vivo (horas:minutos:segundos) hacia el evento futuro más cercano
   de cualquier categoría.
2. **Given** no hay ningún evento futuro cargado, **When** un visitante abre la página
   principal, **Then** el countdown muestra un estado vacío claro (no un error ni un contador
   congelado en cero).
3. **Given** el visitante está viendo el calendario, **When** selecciona la categoría
   "Deportes → Fútbol" en el filtro, **Then** además aparece habilitado el filtro de género
   (Masculino/Femenino) y la lista se reduce a eventos de Fútbol.
4. **Given** el visitante tiene seleccionada la categoría "Deportes → Vóley" (o cualquier
   categoría no futbolística), **When** revisa los filtros disponibles, **Then** el filtro de
   género está deshabilitado u oculto, porque no aplica.
5. **Given** el visitante ve la lista o el calendario, **When** hace clic en una actividad,
   **Then** se abre un modal con título, fecha/hora, lugar, carácter (obligatorio/voluntario),
   descripción, información extra (si existe) y resultado (si existe y ya ocurrió).
6. **Given** un evento está marcado como `obligatorio`, **When** se muestra en el calendario o
   en el modal, **Then** lleva una insignia visual claramente distinguible de un evento
   `voluntario`.
7. **Given** el visitante abre los desplegables de categoría en cualquier parte del sitio,
   **When** los revisa, **Then** el orden es siempre: General, Deportes (Fútbol, Vóley,
   Básquet), Edición, Mercadeo, RRPP, Talento Humano (DH).

---

### User Story 2 - Directivo publica y mantiene actividades (Priority: P2)

Uno de los seis directivos (uno por área: General, Deportes, Edición, Mercadeo, RRPP,
Talento Humano) inicia sesión en el panel administrativo para crear, editar o eliminar
actividades de su área, incluyendo registrar el resultado de un partido ya finalizado.

**Why this priority**: Sin esta vía, el calendario público queda vacío o desactualizado; es
el segundo pilar del producto pero depende de que exista contenido (Story 1) para tener
sentido de mostrarse.

**Independent Test**: Se puede probar iniciando sesión con una credencial directiva de
prueba y ejecutando el ciclo crear → editar → eliminar una actividad, verificando en cada
paso que el cambio se refleje en la vista pública.

**Acceptance Scenarios**:

1. **Given** un visitante sin sesión iniciada, **When** intenta acceder a `/admin` (o
   equivalente), **Then** es redirigido a la pantalla de inicio de sesión.
2. **Given** un directivo con credenciales válidas, **When** inicia sesión, **Then** accede al
   panel y ve la lista de actividades existentes con acciones de crear/editar/eliminar.
3. **Given** el directivo está creando una actividad y elige la categoría "Deportes → Fútbol",
   **When** llena el formulario, **Then** el campo género es obligatorio de seleccionar
   (Masculino/Femenino).
4. **Given** el directivo elige cualquier categoría distinta de Fútbol, **When** llena el
   formulario, **Then** el campo género no se muestra (o se muestra deshabilitado) y el
   sistema asigna automáticamente "no aplica" al guardar.
5. **Given** el directivo no selecciona un carácter, **When** intenta guardar la actividad,
   **Then** el sistema lo bloquea porque "carácter" (obligatorio/voluntario) es requerido.
6. **Given** un partido de Fútbol/Vóley/Básquet ya ocurrió, **When** el directivo edita esa
   actividad para registrar el resultado, **Then** el resultado queda guardado y visible en el
   modal público de esa actividad.
7. **Given** un directivo elimina una actividad, **When** la eliminación se confirma, **Then**
   la actividad deja de aparecer inmediatamente en la vista pública.
8. **Given** credenciales inválidas, **When** se intenta iniciar sesión, **Then** el sistema
   rechaza el acceso con un mensaje de error genérico (sin revelar si el usuario existe).

---

### Edge Cases

- ¿Qué ve el visitante si hay dos eventos exactamente a la misma hora? (El countdown apunta al
  próximo por hora de inicio; ambos deben listarse igualmente en el calendario de ese día/hora.)
- ¿Qué pasa si un directivo cambia la categoría de una actividad de "Fútbol" a "Vóley" después
  de haberle asignado género? El sistema debe reasignar automáticamente "no aplica" al guardar.
- ¿Qué pasa si un evento no tiene `end_time`? Debe tratarse como un evento de duración/hora de
  cierre no especificada, sin romper el cálculo del countdown ni la vista de calendario.
- ¿Qué pasa si un directivo intenta guardar una actividad con `start_time` en el pasado? Se
  permite (para registrar actividades ya realizadas con su resultado), pero no debe alterar el
  cálculo del "próximo evento" del countdown.
- ¿Qué pasa si la sesión de un directivo expira mientras edita una actividad? El sistema debe
  rechazar el guardado y devolverlo a la pantalla de login sin perder silenciosamente los datos
  (debe poder reintentar tras reautenticarse).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar una vista pública, sin necesidad de autenticarse, con
  todas las actividades futuras y pasadas del grupo NEXOS.
- **FR-002**: El sistema MUST mostrar un contador en vivo (horas:minutos:segundos) hacia la
  próxima actividad futura no cancelada, sin importar su categoría, actualizado en tiempo real.
- **FR-003**: El sistema MUST ofrecer una vista de calendario navegable en modo mensual y
  semanal.
- **FR-004**: El sistema MUST permitir filtrar las actividades por categoría, respetando
  siempre el orden fijo: General, Deportes (Fútbol, Vóley, Básquet), Edición, Mercadeo, RRPP,
  Talento Humano (DH).
- **FR-005**: El sistema MUST habilitar el filtro/campo de género (Masculino/Femenino) única y
  exclusivamente cuando la categoría/subcategoría activa es Fútbol; para cualquier otra
  categoría MUST asignar "no aplica" automáticamente y ocultar o deshabilitar el selector.
- **FR-006**: El sistema MUST permitir filtrar actividades por carácter (Obligatorio /
  Voluntario).
- **FR-007**: El sistema MUST exigir que toda actividad tenga un carácter asignado
  (Obligatorio o Voluntario) y MUST mostrar una insignia visual destacada en las actividades
  obligatorias.
- **FR-008**: El sistema MUST abrir, al hacer clic en una actividad, un modal de detalle con
  título, fecha/hora, lugar, carácter, descripción, información extra (si existe) y resultado
  (si existe).
- **FR-009**: El sistema MUST permitir registrar información extra (notas, vestimenta, enlaces)
  como campo opcional de texto libre por actividad.
- **FR-010**: El sistema MUST permitir registrar un resultado/marcador como campo opcional de
  texto libre por actividad, pensado para partidos ya finalizados.
- **FR-011**: El sistema MUST proteger toda ruta administrativa, redirigiendo a la pantalla de
  inicio de sesión a cualquier visitante sin sesión iniciada.
- **FR-012**: El sistema MUST autenticar directivos mediante correo electrónico y contraseña.
- **FR-013**: El sistema MUST permitir, únicamente a directivos autenticados, crear, editar y
  eliminar actividades (CRUD completo).
- **FR-014**: El sistema MUST validar, en el formulario de creación/edición, que una actividad
  tenga como mínimo título, categoría, carácter, fecha/hora de inicio y lugar antes de poder
  guardarse.
- **FR-015**: El sistema MUST reflejar cualquier cambio (creación, edición, eliminación) hecho
  desde el panel administrativo en la vista pública sin intervención manual adicional.
- **FR-016**: El sistema MUST impedir que un visitante sin sesión iniciada cree, edite o
  elimine actividades, incluso si intenta invocar la funcionalidad directamente (no solo
  ocultando el botón en la interfaz).
- **FR-017**: La interfaz pública y administrativa MUST proyectar la identidad de NEXOS como
  periódico estudiantil — creativa, dinámica y visualmente atractiva — y MUST NOT usar
  tipografías, iconografía o tratamientos visuales que evoquen un producto tecnológico
  genérico o futurista (sin fuentes "tech" tipo monospace/geométricas de dashboard, sin
  gradientes neón ni glassmorphism).
- **FR-018**: Cada categoría MUST tener un color de marca coherente y consistente en todo el
  sitio: Talento Humano (DH) = verde, Edición = azul, Mercadeo = morado, RRPP = rojo;
  General deriva su color del logo oficial de NEXOS; Deportes - Fútbol, Deportes - Vóley y
  Deportes - Básquet comparten un único escudo oficial y por lo tanto el mismo color de
  marca (se distinguen entre sí por el texto de la categoría, no por el color). Todos estos
  colores ya están resueltos a partir de los assets en `public/brand/` (ver `research.md`
  §8).
- **FR-019**: Todo uso de color como distintivo (color de categoría, etiqueta de género) MUST
  ir siempre acompañado de una etiqueta de texto visible — el color nunca es la única señal.

### Key Entities

- **Actividad (Event)**: título, descripción, información extra (opcional), categoría (una de
  las 6 fijas, con Deportes subdividida en Fútbol/Vóley/Básquet), género (solo aplica a Fútbol;
  "no aplica" en el resto), carácter (obligatorio/voluntario), fecha/hora de inicio, fecha/hora
  de fin (opcional), lugar, resultado (opcional, texto libre).
- **Directivo (Directive User)**: una de las seis personas responsables de un área (General,
  Deportes, Edición, Mercadeo, RRPP, Talento Humano), con credenciales de acceso al panel
  administrativo y permiso para gestionar actividades.
- **Activo de marca (Brand Asset)**: archivo de logo oficial (general o por disciplina
  deportiva) provisto por NEXOS, fuente de la paleta de colores del sitio para las
  categorías que no tienen color fijo asignado (General, Deportes).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visitante puede identificar cuál es la próxima actividad de NEXOS y cuánto
  falta para que empiece en menos de 5 segundos desde que carga la página, sin necesidad de
  navegar o filtrar nada.
- **SC-002**: El 100% de las actividades de categoría Fútbol muestran su género correctamente;
  el 0% de las actividades de cualquier otra categoría muestra un selector o etiqueta de género.
- **SC-003**: Un directivo sin entrenamiento previo puede publicar una actividad nueva y verla
  reflejada en la vista pública en menos de 2 minutos.
- **SC-004**: El 100% de los intentos de crear, editar o eliminar una actividad sin sesión
  iniciada son rechazados por el sistema.
- **SC-005**: En el 100% de los desplegables y filtros de categoría del sitio, el orden
  mostrado coincide con el orden fijo definido (General, Deportes, Edición, Mercadeo, RRPP,
  Talento Humano).
- **SC-006**: Las actividades marcadas como "obligatorio" son identificables visualmente por un
  visitante en menos de 1 segundo de ver la tarjeta/fila, sin necesidad de abrir el detalle.
- **SC-007**: En una revisión informal con miembros de NEXOS, la interfaz se percibe como
  coherente con la identidad de un periódico estudiantil (creativa, dinámica, propia), no
  como un panel o dashboard genérico de software.

## Assumptions

- Las seis cuentas directivas (una por área: General, Deportes, Edición, Mercadeo, RRPP,
  Talento Humano) son creadas manualmente por quien administra el proyecto; no existe registro
  público de nuevas cuentas.
- No hay un rol "super-admin" separado de los 6 directivos: cualquier directivo autenticado
  puede gestionar actividades de cualquier categoría (no solo la suya), salvo que se indique lo
  contrario más adelante.
- Las fechas/horas se muestran al visitante en su zona horaria local (el sistema las guarda con
  zona horaria explícita); no se asume una única zona horaria fija para todo el grupo.
- **Confirmado**: "Cumpleaños" queda excluido a propósito — NEXOS ya no quiere documentar
  cumpleaños en el calendario. La v2 usa exactamente las 6 categorías fijas del input, con
  Mercadeo y Talento Humano (DH) como áreas separadas (a diferencia del "Merc y DH" combinado
  de la v1).
- Todos los colores de categoría ya se extrajeron de los archivos reales en `public/brand/`
  (ver `public/brand/README.md` y `research.md` §8); no quedan colores pendientes. Fútbol,
  Vóley y Básquet comparten un único escudo oficial y por lo tanto el mismo color.
- Un visitante puede ver actividades pasadas (historial), no solo futuras; no se especificó lo
  contrario y el campo `result` solo tiene sentido si los partidos pasados siguen siendo
  visibles.
- No se requiere soporte multi-idioma; la interfaz es en español, igual que la v1.
