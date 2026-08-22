import { describe, expect, it } from "vitest";
import { CATEGORY_ORDER, genderAppliesTo, isCategory } from "@/lib/categories";

describe("CATEGORY_ORDER", () => {
  it("respeta el orden fijo del spec (FR-004)", () => {
    expect(CATEGORY_ORDER).toEqual([
      "General",
      "Deportes - Fútbol",
      "Deportes - Vóley",
      "Deportes - Básquet",
      "Edición",
      "Mercadeo",
      "RRPP",
      "Talento Humano (DH)",
    ]);
  });
});

describe("genderAppliesTo", () => {
  it("es true solo para Deportes - Fútbol", () => {
    expect(genderAppliesTo("Deportes - Fútbol")).toBe(true);
  });

  it("es false para el resto de categorías, incluyendo otros deportes", () => {
    const nonFutbol = CATEGORY_ORDER.filter((c) => c !== "Deportes - Fútbol");
    for (const category of nonFutbol) {
      expect(genderAppliesTo(category)).toBe(false);
    }
  });
});

describe("isCategory", () => {
  it("acepta valores válidos y rechaza cualquier otro string", () => {
    expect(isCategory("General")).toBe(true);
    expect(isCategory("Deportes - Fútbol")).toBe(true);
    expect(isCategory("Cumpleaños")).toBe(false);
    expect(isCategory("")).toBe(false);
  });
});
