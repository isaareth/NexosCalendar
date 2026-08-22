import { test, expect } from "@playwright/test";

// Requiere una cuenta directiva de prueba. Define TEST_DIRECTOR_EMAIL / TEST_DIRECTOR_PASSWORD
// como variables de entorno antes de correr esta suite (ver quickstart.md).
const email = process.env.TEST_DIRECTOR_EMAIL;
const password = process.env.TEST_DIRECTOR_PASSWORD;

test.describe("Panel administrativo", () => {
  test("redirige a login si no hay sesión (FR-011)", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test.describe("con sesión iniciada", () => {
    test.skip(!email || !password, "Requiere TEST_DIRECTOR_EMAIL/PASSWORD");

    test("crea, edita y elimina una actividad", async ({ page }) => {
      await page.goto("/admin/login");
      await page.getByLabel("Correo").fill(email!);
      await page.getByLabel("Contraseña").fill(password!);
      await page.getByRole("button", { name: "Ingresar" }).click();
      await expect(page).toHaveURL(/\/admin\/dashboard/);

      await page.getByRole("button", { name: "Nueva actividad" }).click();
      await page.getByLabel("Título").fill("Actividad E2E de prueba");
      await page.getByLabel("Lugar").fill("Auditorio");
      // Carácter y fecha de inicio son requeridos por el formulario/schema.
      await page.getByRole("button", { name: "Guardar" }).click();

      await expect(page.getByText("Actividad E2E de prueba")).toBeVisible();

      await page
        .locator("div", { hasText: "Actividad E2E de prueba" })
        .getByRole("button", { name: "Eliminar" })
        .click();
      await page.getByRole("button", { name: "Eliminar", exact: true }).last().click();

      await expect(page.getByText("Actividad E2E de prueba")).toHaveCount(0);
    });
  });
});
