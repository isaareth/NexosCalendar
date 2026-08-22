/**
 * Fuente única del color por categoría y por género. Constitución, Principio VI.
 * Valores extraídos de public/brand/ — ver specs/001-nexos-agenda/research.md §8.
 * Ningún componente debe hardcodear un color de categoría/género fuera de este archivo.
 */
import type { Category } from "./categories";

export const CATEGORY_COLOR: Record<Category, string> = {
  General: "#234090", // extraído de public/brand/logo-nexos.jpg
  "Deportes - Fútbol": "#73528E", // extraído de public/brand/deportes.png
  "Deportes - Vóley": "#73528E", // mismo escudo/color que Fútbol
  "Deportes - Básquet": "#73528E", // mismo escudo/color que Fútbol
  Edición: "#2563EB",
  Mercadeo: "#9333EA",
  RRPP: "#DC2626",
  "Talento Humano (DH)": "#16A34A",
};

export const CATEGORY_COLOR_TINT: Partial<Record<Category, string>> = {
  "Deportes - Fútbol": "#E4BEFC",
  "Deportes - Vóley": "#E4BEFC",
  "Deportes - Básquet": "#E4BEFC",
};

export const GENDER_COLOR = {
  masculino: "#2DD4BF",
  femenino: "#F472B6",
} as const;

export type Gender = keyof typeof GENDER_COLOR | "no_aplica";
