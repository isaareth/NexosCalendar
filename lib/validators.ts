import { genderAppliesTo, isCategory } from "./categories";
import type { EventInput } from "./types";

export type ValidatedEventInput = Omit<EventInput, "gender"> & {
  gender: "masculino" | "femenino" | "no_aplica";
};

export type ValidationResult =
  | { valid: true; errors: []; data: ValidatedEventInput }
  | { valid: false; errors: string[]; data?: undefined };

/**
 * Valida y normaliza un EventInput. Se usa tanto en el formulario (UX) como dentro de las
 * Server Actions de escritura (defensa en profundidad — FR-016). No reimplementa la regla
 * de género: la reutiliza desde lib/categories.ts (Constitución, Principio II).
 */
export function validateEventInput(input: Partial<EventInput>): ValidationResult {
  const errors: string[] = [];

  const title = input.title?.trim();
  if (!title) errors.push("El título es obligatorio.");

  if (!input.category || !isCategory(input.category)) {
    errors.push("La categoría es obligatoria y debe ser una de las categorías válidas.");
  }

  if (!input.character || !["obligatorio", "voluntario"].includes(input.character)) {
    errors.push('El carácter es obligatorio ("obligatorio" o "voluntario").');
  }

  if (!input.start_time || Number.isNaN(Date.parse(input.start_time))) {
    errors.push("La fecha/hora de inicio es obligatoria y debe ser una fecha válida.");
  }

  if (input.end_time) {
    if (Number.isNaN(Date.parse(input.end_time))) {
      errors.push("La fecha/hora de fin no es válida.");
    } else if (input.start_time && input.end_time < input.start_time) {
      errors.push("La fecha/hora de fin no puede ser anterior a la de inicio.");
    }
  }

  const location = input.location?.trim();
  if (!location) errors.push("El lugar es obligatorio.");

  if (errors.length > 0 || !input.category || !isCategory(input.category)) {
    return { valid: false, errors };
  }

  const gender: "masculino" | "femenino" | "no_aplica" = genderAppliesTo(input.category)
    ? (input.gender ?? "no_aplica")
    : "no_aplica";

  return {
    valid: true,
    errors: [],
    data: {
      title: title!,
      description: input.description?.trim() || undefined,
      extra_info: input.extra_info?.trim() || undefined,
      category: input.category,
      gender,
      character: input.character as EventInput["character"],
      start_time: input.start_time!,
      end_time: input.end_time || undefined,
      location: location!,
      result: input.result?.trim() || undefined,
    },
  };
}
