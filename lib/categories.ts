/**
 * Fuente única del orden de categorías y de la regla "género solo aplica a Fútbol".
 * Constitución, Principio II — ningún otro archivo debe redefinir esta lista o condición.
 * Ver specs/001-nexos-agenda/data-model.md.
 */

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

export function isCategory(value: string): value is Category {
  return (CATEGORY_ORDER as readonly string[]).includes(value);
}

export function genderAppliesTo(category: Category): boolean {
  return category === "Deportes - Fútbol";
}

/** El marcador y "ganado/perdido/empate" (FR-023) solo aplican a categorías deportivas. */
export function outcomeAppliesTo(category: Category): boolean {
  return category.startsWith("Deportes - ");
}

const CATEGORY_LABELS: Record<Category, string> = {
  General: "General",
  "Deportes - Fútbol": "Deportes · Fútbol",
  "Deportes - Vóley": "Deportes · Vóley",
  "Deportes - Básquet": "Deportes · Básquet",
  Edición: "Edición",
  Mercadeo: "Mercadeo",
  RRPP: "RRPP",
  "Talento Humano (DH)": "Talento Humano (DH)",
};

export function categoryLabel(category: Category): string {
  return CATEGORY_LABELS[category];
}
