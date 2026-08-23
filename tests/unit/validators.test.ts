import { describe, expect, it } from "vitest";
import { validateEventInput } from "@/lib/validators";
import type { EventOutcome } from "@/lib/types";

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

  it("acepta outcome en una categoría deportiva (FR-023)", () => {
    const result = validateEventInput({ ...base, outcome: "ganado" });
    expect(result.valid).toBe(true);
    expect(result.data?.outcome).toBe("ganado");
  });

  it("normaliza outcome a null fuera de categorías deportivas, incluso si se envía uno", () => {
    const result = validateEventInput({
      ...base,
      category: "Edición",
      character: "obligatorio",
      outcome: "ganado",
    });
    expect(result.valid).toBe(true);
    expect(result.data?.outcome).toBeNull();
  });

  it("outcome queda en null (no undefined) cuando no se elige, para poder limpiar en un UPDATE", () => {
    const result = validateEventInput(base);
    expect(result.valid).toBe(true);
    expect(result.data?.outcome).toBeNull();
  });

  it("rechaza un outcome que no es ganado/perdido/empate", () => {
    const result = validateEventInput({
      ...base,
      outcome: "victoria" as EventOutcome,
    });
    expect(result.valid).toBe(false);
  });
});
