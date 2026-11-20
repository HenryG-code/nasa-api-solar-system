import { test, expect } from "./fixtures.js";

test.describe("NASA photo archive", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#gallery").scrollIntoViewIfNeeded();
  });

  test("shows a first page of 12 relevant, de-duplicated photos", async ({ page }) => {
    const cards = page.locator("#galleryGrid .gallery-card");
    await expect(cards).toHaveCount(12);

    const titles = await page.locator("#galleryGrid .gallery-card h3").allTextContents();
    expect(new Set(titles).size).toBe(titles.length);
    // Filtered out by the site: off-topic and too-small images.
    expect(titles.join(" ")).not.toMatch(/rover|tiny thumbnail/i);
  });

  test("Load more appends the next page", async ({ page }) => {
    await expect(page.locator("#galleryGrid .gallery-card")).toHaveCount(12);
    await page.locator("#loadMoreButton").click();
    await expect(page.locator("#galleryGrid .gallery-card")).toHaveCount(24);

    const titles = await page.locator("#galleryGrid .gallery-card h3").allTextContents();
    expect(new Set(titles).size).toBe(titles.length);
  });

  test("selecting a destination reloads the archive for it", async ({ page }) => {
    await page.locator('.rail-chip[data-node-id="saturn"]').click();

    await expect(page.locator("#galleryTitle")).toHaveText("Photos of Saturn");
    await expect(page.locator("#galleryGrid .gallery-card h3").first()).toContainText("Saturn");
  });

  test("photos open full size and step with the arrow keys", async ({ page }) => {
    const titles = await page.locator("#galleryGrid .gallery-card h3").allTextContents();

    await page.locator("#galleryGrid .gallery-card button").first().click();
    const dialog = page.locator("#imageDialog");
    await expect(dialog).toBeVisible();
    await expect(page.locator("#dialogTitle")).toHaveText(titles[0]);
    await expect(page.locator("#dialogLink")).toHaveAttribute("href", /images\.nasa\.gov\/details\//);

    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#dialogTitle")).toHaveText(titles[1]);
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator("#dialogTitle")).toHaveText(titles[0]);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});
