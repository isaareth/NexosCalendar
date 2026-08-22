/**
 * Fuente única del color por categoría y por género. Constitución, Principio VI.
 * Valores extraídos de public/brand/ y ajustados por feedback del usuario — ver
 * specs/001-nexos-agenda/research.md §8. Ningún componente debe hardcodear un color de
 * categoría/género fuera de este archivo.
 */
import type { Category } from "./categories";
import type { EventGender } from "./types";

/**
 * Color de categoría "puro" — usado donde solo se conoce la categoría, sin un evento
 * concreto (ej. el chip de "Deportes - Fútbol" en los filtros, antes de elegir género).
 */
export const CATEGORY_COLOR: Record<Category, string> = {
  General: "#234090", // extraído de public/brand/logo-nexos.jpg
  "Deportes - Fútbol": "#73528E", // extraído de public/brand/deportes.png
  "Deportes - Vóley": "#CA8A04", // amarillo — a pedido del usuario
  "Deportes - Básquet": "#EA580C", // naranja — a pedido del usuario
  Edición: "#2563EB",
  Mercadeo: "#9333EA",
  RRPP: "#DC2626",
  "Talento Humano (DH)": "#16A34A",
};

export const GENDER_COLOR = {
  masculino: "#2DD4BF", // aguamarina
  femenino: "#F472B6", // rosado
} as const;

export type Gender = keyof typeof GENDER_COLOR | "no_aplica";

/**
 * Color representativo de una actividad concreta. En Fútbol, el color depende del género
 * (rosado para femenino, aguamarina para masculino) en vez del morado genérico de
 * categoría — a pedido del usuario, para distinguir los partidos de niñas/niños en el
 * calendario. El resto de categorías usa su color fijo de CATEGORY_COLOR.
 */
export function eventColor(event: { category: Category; gender: EventGender }): string {
  if (event.category === "Deportes - Fútbol") {
    if (event.gender === "masculino") return GENDER_COLOR.masculino;
    if (event.gender === "femenino") return GENDER_COLOR.femenino;
  }
  return CATEGORY_COLOR[event.category];
}

/** Blanco no siempre contrasta bien (ej. sobre amarillo) — texto legible por categoría. */
export function eventColorForeground(event: { category: Category; gender: EventGender }): string {
  if (event.category === "Deportes - Vóley") return "#1C1A16";
  return "#FFFFFF";
}
