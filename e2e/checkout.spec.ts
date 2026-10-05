import { expect, test } from "@playwright/test";

test("customer picks Yandex delivery, pays and sees the order result page", async ({ page, request }) => {
  const response = await request.get("http://localhost:4000/api/products?limit=1");
  const { items } = await response.json() as { items: unknown[] };
  await page.goto("/");
  await page.evaluate((product) => {
    localStorage.setItem("aminoclub_cart_v1", JSON.stringify([{ product, quantity: 1 }]));
  }, items[0]);

  await page.goto("/checkout");
  await page.locator('input[name="firstName"]').fill("Иван");
  await page.locator('input[name="lastName"]').fill("Покупатель");
  await page.locator('input[name="email"]').fill(`checkout.${Date.now()}@aminoclub.local`);
  await page.locator('input[name="phone"]').fill("+7 999 000-00-03");

  await page.getByTestId("delivery-city").fill("Москва");
  await page.getByRole("button", { name: "Москва", exact: true }).click();
  await page.getByTestId("pickup-points").getByRole("button").first().click();
  await expect(page.getByTestId("delivery-quote")).toContainText("350");

  await page.getByRole("radio", { name: "Курьером до двери" }).click();
  await page.getByLabel("Улица").fill("Тверская улица");
  await page.getByLabel("Дом, корпус").fill("1");
  await expect(page.getByTestId("delivery-quote")).toContainText("500");

  await page.getByRole("button", { name: "Оплатить" }).click();
  await expect(page).toHaveURL(/\/order\/success\?.*demo=1/);
  const result = page.getByTestId("order-result");
  await expect(result).toContainText("Номер заказа");
  await expect(result).toContainText("Москва, Тверская улица, 1");
  await expect(result).toContainText("включая доставку 500");
});
