import { expect, type Page } from "@playwright/test";

/** Ticks the required personal data consent box the way a visitor does: by clicking its visible square. */
export async function acceptPersonalDataConsent(page: Page) {
  const consent = page.locator('label:has(input[name="consent"])');
  await consent.locator('span[aria-hidden="true"]').click();
  await expect(consent.locator('input[name="consent"]')).toBeChecked();
}

/** Remembers a cookie choice before any page script runs, so the banner does not cover form buttons. */
export async function dismissCookieBanner(page: Page) {
  await page.addInitScript(() => window.localStorage.setItem("aminoclub_cookie_consent_v1", "necessary"));
}
