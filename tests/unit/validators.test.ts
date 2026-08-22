import { describe, expect, it } from "vitest";
import { validateEventInput } from "@/lib/validators";

const base = {
  title: "Partido vs. Rival",
  category: "Deportes - Fútbol" as const,
  character: "obligatorio" as const,
  start_time: "2026-09-01T18:00:00.000Z",
  location: "Cancha principal",
};

describe("validateEventInput", () => {
  it("acepta un input válido de Fútbol con género", () => {
    const result = validateEventInput({ ...base, gender: "masculino" });
    expect(result.valid).toBe(true);
    expect(result.data?.gender).toBe("masculino");
  });

  it("normaliza gender a no_aplica fuera de Fútbol aunque el cliente envíe uno (FR-005)", () => {
    const result = validateEventInput({
      ...base,
      category: "Deportes - Vóley",
      gender: "masculino",
    });
    expect(result.valid).toBe(true);
    expect(result.data?.gender).toBe("no_aplica");
  });

  it("rechaza un input sin carácter", () => {
    const result = validateEventInput({ ...base, character: undefined });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rechaza un input sin título ni lugar", () => {
    const result = validateEventInput({ ...base, title: "", location: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("El título es obligatorio.");
    expect(result.errors).toContain("El lugar es obligatorio.");
  });

  it("rechaza end_time anterior a start_time", () => {
    const result = validateEventInput({
      ...base,
      end_time: "2026-09-01T10:00:00.000Z",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("fin"))).toBe(true);
  });

  it("rechaza una categoría inválida", () => {
    const result = validateEventInput({
      ...base,
      // @ts-expect-error -- probando una categoría fuera de CATEGORY_ORDER
      category: "Cumpleaños",
    });
    expect(result.valid).toBe(false);
  });
});
