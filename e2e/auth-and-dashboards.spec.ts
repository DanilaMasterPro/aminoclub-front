import { expect, test, type Page } from "@playwright/test";

async function login(page: Page, email: string) {
  await page.goto("/login");
  await page.getByTestId("login-email").fill(email);
  await page.getByTestId("login-submit").click();
  const devCodeText = await page.getByText(/Dev-код:/).textContent();
  const code = devCodeText?.match(/\d{6}/)?.[0];
  expect(code).toBeTruthy();
  await page.getByTestId("login-code").fill(code!);
  await page.getByTestId("login-submit").click();
}

test("homepage loads catalog products from the API and filters categories", async ({ page }) => {
  await page.goto("/");

  const products = page.getByTestId("catalog-product");
  await expect(products.filter({ hasText: "Сывороточный протеин" })).toHaveCount(4);
  await expect(products.filter({ hasText: "BCAA 2:1:1" })).toHaveCount(4);

  await page.getByRole("tab", { name: "Протеин", exact: true }).click();
  await expect(products).toHaveCount(4);
  await expect(products.first()).toContainText("Сывороточный протеин");

  await page.getByRole("tab", { name: "Аминокислоты", exact: true }).click();
  await expect(products).toHaveCount(4);
  await expect(products.first()).toContainText("BCAA 2:1:1");
});

test("admin signs in with OTP and opens catalog management", async ({ page }) => {
  await login(page, "admin@aminoclub.local");
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Обзор магазина" })).toBeVisible();
  const menu = page.getByRole("button", { name: "Меню", exact: true });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole("link", { name: "Товары", exact: true }).click();
  await expect(page.getByTestId("admin-products")).toBeVisible();
  await page.getByRole("link", { name: "Добавить" }).click();
  await expect(page.getByTestId("admin-products-form")).toBeVisible();
});

test("trainer signs in with OTP and sees referral tools", async ({ page }) => {
  await login(page, "trainer.e2e@aminoclub.local");
  await expect(page).toHaveURL(/\/trainer$/);
  await expect(page.getByRole("heading", { name: "Тестовый Тренер" })).toBeVisible();
  await expect(page.getByText("Реферальные инструменты")).toBeVisible();
  await expect(page.getByLabel("Ссылка")).toHaveValue(/ref=e2etrainer/);
  await expect(page.getByLabel("Промокод")).toHaveValue("E2EFIT10");
});
