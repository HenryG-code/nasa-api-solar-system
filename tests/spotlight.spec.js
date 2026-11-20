import { test, expect } from "./fixtures.js";

test.describe("spotlight", () => {
  test("shows NASA's Astronomy Picture of the Day", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("#apodTitle")).toHaveText("Fixture Nebula");
    await expect(page.locator("#apodEyebrow")).toHaveText("Astronomy Picture of the Day");
    await expect(page.locator("#apodMedia img")).toHaveAttribute("alt", "Fixture Nebula");
    await expect(page.locator("#apodLink")).toHaveAttribute("href", /images-assets\.nasa\.gov/);
  });

  test("falls back to a high-resolution archive image when APOD fails", async ({ page }) => {
    await page.route("https://api.nasa.gov/planetary/apod**", (route) => route.fulfill({ status: 500, body: "error" }));
    await page.goto("/");

    await expect(page.locator("#apodEyebrow")).toHaveText("Archive spotlight");
    await expect(page.locator("#apodTitle")).toHaveText(/^Archive image /);

    const media = page.locator("#apodMedia img");
    await expect(media).toHaveAttribute("srcset", /\d+w/);
    await expect(page.locator("#apodLink")).toHaveAttribute("href", /images\.nasa\.gov\/details\//);
    // The same image becomes the hero backdrop.
    await expect(page.locator("#heroBackdrop")).toHaveClass(/is-loaded/);
  });

  test("escapes and validates APOD video URLs", async ({ page }) => {
    await page.route("https://api.nasa.gov/planetary/apod**", (route) =>
      route.fulfill({
        json: { title: "Video day", media_type: "video", url: 'javascript:alert("x")', explanation: "" },
      }),
    );
    await page.goto("/");

    await expect(page.locator("#apodTitle")).toHaveText("Video day");
    // An unsafe URL must never become an iframe source.
    await expect(page.locator("#apodMedia iframe")).toHaveCount(0);
  });
});
