<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Modified principles: none
- Added principles: VI. Editorial Identity, Not Tech Aesthetic
- Added sections: Brand Assets (under Technology Constraints)
- Removed sections: none
- Deferred TODOs: exact hex values for General/Deportes categories pending logo files in
  public/brand/ (see Principle VI and specs/001-nexos-agenda/spec.md FR-017)
-->
# NEXOS Agenda Constitution

## Core Principles

### I. Free-Tier First
The platform MUST run entirely within free-tier limits of its chosen providers (Vercel
hosting, Supabase database/auth). No feature may be designed in a way that requires a
paid plan, paid add-on, or metered third-party service to function. Before adding any
dependency or provider, its free-tier limits MUST be checked against realistic usage
for a single student group (low traffic, small dataset).
**Rationale**: NEXOS is a student group with no budget; a feature that works in a demo
but silently requires payment at real usage is a failed feature.

### II. Business Rules Are Enforced Once, at the Data Boundary
The category order (General, Deportes → Fútbol/Vóley/Básquet, Edición, Mercadeo, RRPP,
Talento Humano), the `gender` field's restriction to the Fútbol subcategory, and the
`obligatorio`/`voluntario` character are domain rules, not UI conventions. They MUST be
enforced by database constraints/enums and a single shared validation module consumed by
both the public view and the admin CRUD forms. UI components MUST read category order and
gender-applicability from that shared source — MUST NOT hardcode the order or the
Fútbol-only condition in more than one place.
**Rationale**: The original v1 app duplicated category logic across frontend and backend;
this class of bug (order drifting, gender selector leaking into non-soccer sports) is the
main reason v2 exists.

### III. Security by Default (RLS, Least Privilege)
Row Level Security MUST be enabled on every table holding event or user data. Public
visitors get read-only `SELECT` access; write access (`INSERT`/`UPDATE`/`DELETE`) is
restricted to `authenticated` sessions belonging to the six directive roles. The Supabase
service-role key MUST NEVER be shipped to the client or referenced in a Client Component;
it may only be used in trusted server contexts (Server Actions, Route Handlers) when a
policy genuinely cannot be expressed as RLS. Every new table or policy change MUST be
reviewed against this principle before merge.
**Rationale**: The admin panel is the only gate protecting write access for a public,
unauthenticated calendar; a missed policy exposes the whole dataset to tampering.

### IV. Server-First, Typed Architecture
Next.js App Router is used with Server Components and Server Actions as the default;
a component MUST justify becoming a Client Component (interactivity, browser-only APIs,
local state) rather than being Client by default. TypeScript strict mode is mandatory
project-wide — no `any` without an inline justification. Supabase client instances MUST
go through the shared `/lib/supabase` server/browser factories rather than being
constructed ad hoc.
**Rationale**: Keeps data fetching close to the database, minimizes client bundle size
on a free Vercel plan, and prevents the two-client (server/browser) confusion that causes
subtle auth bugs in Supabase + Next.js apps.

### V. Simplicity and Spec Fidelity
Implement what the active spec describes — no speculative fields, roles, or
configuration options "for later." Every deviation from the approved spec/plan (new
table, new dependency, new environment variable) MUST be reflected back into the spec
before or alongside the code change, not left implicit in a PR description.
**Rationale**: This project is deliberately run as spec-driven development; specs and
code drifting apart defeats the point of the methodology.

### VI. Editorial Identity, Not Tech Aesthetic
NEXOS is a student newspaper/group, not a tech product. The interface MUST read as
creative, dynamic, and warm — editorial in spirit — and MUST NOT use typography, iconography,
color treatments, or layout patterns that evoke a generic tech/SaaS dashboard or a
futuristic aesthetic (no monospace/geometric "tech" display fonts, no neon gradients or
glassmorphism, no glowing/neon accents). Brand colors MUST be coherent with the official
NEXOS assets in `public/brand/` (extracted from the logo, not invented ad hoc), combined with
the fixed department colors already assigned: Talento Humano (DH) = verde, Edición = azul,
Mercadeo = morado, RRPP = rojo. Any color-coding (department color, gender tag) MUST always
be paired with a visible text label — color is never the only signal, both for
accessibility and to avoid ambiguity between different color systems (e.g. gender tags and
department colors both using a shade of purple).
**Rationale**: A dashboard-looking calendar would misrepresent what NEXOS is; the group
explicitly wants the public site to feel like an extension of their newspaper identity, not
a generic internal tool.

## Technology Constraints

- **Framework**: Next.js 14+ (App Router, Server Actions).
- **UI**: Tailwind CSS + shadcn/ui (re-themed — colors, radius, and typography overridden to
  match Principle VI, not left at shadcn's default look) + Lucide Icons.
- **Data/Auth**: Supabase (PostgreSQL + Supabase Auth + RLS). No other database or auth
  provider may be introduced without a constitution amendment.
- **Hosting**: Vercel (app) + Supabase Cloud (data/auth), both on free tier.
- **Language**: TypeScript in strict mode across `/app`, `/lib`, and `/components`.
- Six directive accounts are provisioned in Supabase Auth by an administrator (not via
  public self-registration); the app has no public sign-up flow.

### Brand Assets

- Official logo files live in `public/brand/` (`logo-nexos.png`, `public/brand/sports/*`).
- Color tokens are derived from those files plus the four fixed department colors, and MUST
  be defined in exactly one place (`tailwind.config.ts` theme extension / a `lib/theme.ts`
  token file) — consumed by both public and admin UI, mirroring Principle II's
  single-source-of-truth rule but applied to design tokens instead of business data.

## Development Workflow

- Work proceeds through the Spec Kit flow: `/speckit-specify` → `/speckit-plan` →
  `/speckit-tasks` → `/speckit-implement`, in that order, for every feature.
- A feature's spec and plan live under `specs/<feature>/` and are the source of truth;
  code review checks the diff against them, not against memory of the conversation.
- Business-rule changes (category list, gender rule, character values) always start as a
  constitution or spec amendment, never as a direct code edit.
- `/code-review` (or equivalent) is run on non-trivial changes before merge, checking at
  minimum: RLS policy correctness, category/gender rule centralization (Principle II),
  and absence of service-role key leakage to the client (Principle III).

## Governance

This constitution supersedes ad hoc conventions for the NEXOS Agenda project. Amendments
are made via `/speckit-constitution`, require stating the version bump rationale
(MAJOR: incompatible principle removal/redefinition; MINOR: new/expanded principle or
section; PATCH: clarification/typo), and must update the Sync Impact Report at the top of
this file. Any PR or task that conflicts with a principle here must either be revised or
justified with an explicit, reviewed exception recorded in the relevant plan's Complexity
Tracking section.

**Version**: 1.1.0 | **Ratified**: 2026-08-22 | **Last Amended**: 2026-08-22
