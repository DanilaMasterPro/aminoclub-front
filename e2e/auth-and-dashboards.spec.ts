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

test("trainer submits a public affiliate application", async ({ page }) => {
  const email = `affiliate.${Date.now()}@aminoclub.local`;
  await page.goto("/affiliate");

  await expect(page.getByTestId("affiliate-form").locator("input[required], textarea[required]")).toHaveCount(10);

  await page.getByLabel("Имя", { exact: true }).fill("Анна");
  await page.getByLabel("Фамилия", { exact: true }).fill("Тренерова");
  await page.getByLabel("Телефон", { exact: true }).fill("+79990000002");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Город", { exact: true }).fill("Москва");
  await page.getByLabel("Специализация", { exact: true }).fill("Фитнес");
  await page.getByLabel("Социальная сеть", { exact: true }).fill("https://example.com/coach");
  await page.getByLabel("Размер аудитории", { exact: true }).fill("1500");
  await page.getByLabel("Расскажите о себе", { exact: true }).fill("Провожу персональные и групповые тренировки.");
  await page.getByLabel(/Я принимаю условия/).check();
  await page.getByRole("button", { name: "Отправить заявку" }).click();

  await expect(page.getByTestId("affiliate-success")).toBeVisible();

  await login(page, "admin@aminoclub.local");
  await page.goto("/admin/trainer-applications");
  const applicationRow = page.getByRole("row").filter({ hasText: email });
  await applicationRow.getByRole("link", { name: "Открыть" }).click();
  const applicationDetails = page.getByTestId("admin-trainer-application-detail");
  await expect(applicationDetails).toContainText("Анна Тренерова");
  await expect(applicationDetails).toContainText("Москва");
  await expect(applicationDetails).toContainText("https://example.com/coach");
  await expect(applicationDetails).toContainText("1 500");
  await expect(applicationDetails).toContainText("Провожу персональные и групповые тренировки.");
  await expect(page.getByRole("button", { name: "Одобрить заявку" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Отклонить", exact: true })).toBeVisible();
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
  await expect(page.getByTestId("image-dropzone-images")).toContainText("Можно добавить несколько");

  await page.goto("/admin/categories/new");
  await page.getByLabel("Название", { exact: true }).fill("Тестовый Ёж");
  await expect(page.getByLabel("Slug", { exact: true })).toHaveValue("testovyy-yozh");
  await expect(page.getByLabel("SEO title", { exact: true })).toHaveValue("Тестовый Ёж");
  await page.getByLabel("Описание", { exact: true }).fill("Описание тестовой категории");
  await expect(page.getByLabel("SEO description", { exact: true })).toHaveValue("Описание тестовой категории");
  await expect(page.getByTestId("image-dropzone-imageUrl")).toContainText("Файл автоматически сохранится в WebP");
});

test("admin opens the complete trainer profile", async ({ page }) => {
  await login(page, "admin@aminoclub.local");
  await page.goto("/admin/trainers");
  const trainerRow = page.getByRole("row").filter({ hasText: "trainer.e2e@aminoclub.local" });
  await trainerRow.getByRole("link", { name: "Открыть" }).click();

  const trainerDetails = page.getByTestId("admin-trainer-detail");
  await expect(trainerDetails).toContainText("trainer.e2e@aminoclub.local");
  await expect(trainerDetails.getByRole("heading", { name: "Статистика" })).toBeVisible();
  await expect(trainerDetails.getByRole("heading", { name: "Реквизиты и выплаты" })).toBeVisible();
  await expect(trainerDetails.getByRole("button", { name: "Заблокировать" })).toBeVisible();
  await expect(page.getByTestId("admin-trainer-edit-form")).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue("trainer.e2e@aminoclub.local");
  await expect(page.getByLabel("Реферальный код", { exact: true })).toHaveValue("e2etrainer");
  await expect(page.getByRole("button", { name: "Сохранить" })).toBeVisible();
});

test("trainer signs in with OTP and sees referral tools", async ({ page }) => {
  await login(page, "trainer.e2e@aminoclub.local");
  await expect(page).toHaveURL(/\/trainer$/);
  await expect(page.getByRole("heading", { name: "Тестовый Тренер" })).toBeVisible();
  await expect(page.getByText("Реферальные инструменты")).toBeVisible();
  await expect(page.getByLabel("Ссылка")).toHaveValue(/ref=e2etrainer/);
  await expect(page.getByLabel("Промокод")).toHaveValue("E2EFIT10");
});
