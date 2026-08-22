import { test, expect } from "@playwright/test";

// Requiere una base de datos Supabase con datos de prueba cargados (ver quickstart.md).
// Cubre los escenarios de aceptación de User Story 1 (spec.md).

test.describe("Vista pública", () => {
  test("muestra el countdown o el estado vacío", async ({ page }) => {
    await page.goto("/");
    const countdown = page.getByText(/Falta para|no hay ninguna actividad programada/i);
    await expect(countdown).toBeVisible();
  });

  test("el filtro de género solo aparece con Fútbol seleccionado", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByLabel("Filtrar por género")).toHaveCount(0);

    await page.getByLabel("Filtrar por categoría").click();
    await page.getByRole("option", { name: /Deportes · Fútbol/i }).click();

    await expect(page.getByLabel("Filtrar por género")).toBeVisible();

    await page.getByLabel("Filtrar por categoría").click();
    await page.getByRole("option", { name: /Deportes · Vóley/i }).click();

    await expect(page.getByLabel("Filtrar por género")).toHaveCount(0);
  });

  test("abre el modal de detalle al hacer clic en una actividad", async ({ page }) => {
    await page.goto("/");
    const firstEvent = page.locator("button[title]").first();
    if (await firstEvent.count()) {
      await firstEvent.click();
      await expect(page.getByRole("dialog")).toBeVisible();
    }
  });
});
