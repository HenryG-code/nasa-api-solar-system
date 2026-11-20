import { test, expect } from "./fixtures.js";

test.describe("page basics", () => {
  test("loads with title, sections and no script errors", async ({ page, pageErrors }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("Universe Atlas");
    await expect(page.locator("h1")).toHaveText("Watch Earth live from space");

    for (const id of ["top", "spotlight", "iss", "atlas", "gallery"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }

    // Let the app finish booting before checking for errors.
    await expect(page.locator("#galleryGrid .gallery-card").first()).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test("never scrolls sideways", async ({ page }) => {
    await page.goto("/");

    for (const id of ["top", "spotlight", "iss", "atlas", "gallery"]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow near #${id}`).toBeLessThanOrEqual(0);
    }
  });

  test("navigation links point at real sections", async ({ page, isMobile }) => {
    test.skip(isMobile, "The section links are hidden on phones");
    await page.goto("/");

    const links = page.locator(".nav-links a");
    await expect(links).toHaveCount(4);

    for (const href of await links.evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href")))) {
      await expect(page.locator(href)).toHaveCount(1);
    }
  });

  test("skip link jumps to the solar system", async ({ page, isMobile }) => {
    test.skip(isMobile, "Keyboard navigation is a desktop check");
    await page.goto("/");

    await page.keyboard.press("Tab");
    const skip = page.locator(".skip-link");
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute("href", "#atlas");
  });

  test("CSS and JS are revalidated on every visit (no stale deploys)", async ({ page, request }) => {
    await page.goto("/");

    const assets = await page.evaluate(() => [
      document.querySelector('link[rel="stylesheet"][href*="styles.css"]').getAttribute("href"),
      document.querySelector('script[src*="app.js"]').getAttribute("src"),
    ]);

    for (const asset of assets) {
      expect(asset, "asset URLs carry a version").toMatch(/\?v=/);
      const response = await request.get(asset);
      expect(response.ok()).toBeTruthy();
    }
  });
});
