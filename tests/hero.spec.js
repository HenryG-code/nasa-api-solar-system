import { test, expect } from "./fixtures.js";

test.describe("live ISS hero", () => {
  test("embeds NASA's ISS stream muted, with autoplay", async ({ page }) => {
    await page.goto("/");

    const player = page.locator("#heroVideo iframe");
    await expect(player).toHaveCount(1);

    const src = await player.getAttribute("src");
    expect(src).toContain("youtube-nocookie.com/embed/ROboUHfPUrU");
    expect(src).toContain("autoplay=1");
    expect(src).toContain("mute=1");
    // The player must not capture clicks meant for the page.
    await expect(player).toHaveCSS("pointer-events", "none");
  });

  test("calls to action lead to the atlas and the tracker", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".hero-actions a").first()).toHaveAttribute("href", "#atlas");
    await expect(page.locator(".hero-actions a").nth(1)).toHaveAttribute("href", "#iss");
  });

  test("shows a night-side note when the ISS is in Earth's shadow", async ({ page }) => {
    await page.route("https://api.wheretheiss.at/**", (route) =>
      route.fulfill({
        json: { latitude: 0, longitude: 0, altitude: 420, velocity: 27600, visibility: "eclipsed", timestamp: 1795200000 },
      }),
    );
    await page.goto("/");

    await expect(page.locator("#livePillText")).toHaveText(/night side/);
    await expect(page.locator(".hero")).toHaveClass(/is-night/);
  });

  test("the live feed is shown unblended on the night side", async ({ page }) => {
    await page.route("https://api.wheretheiss.at/**", (route) =>
      route.fulfill({
        json: { latitude: 0, longitude: 0, altitude: 420, velocity: 27600, visibility: "eclipsed", timestamp: 1795200000 },
      }),
    );
    await page.goto("/");
    await expect(page.locator(".hero")).toHaveClass(/is-night/);

    // Simulate the player reporting that it is playing.
    await page.locator(".hero").evaluate((hero) => hero.classList.add("is-live"));
    await expect(page.locator(".hero-video")).toHaveCSS("opacity", "1", { timeout: 4000 });
  });

  test("Sound control stays hidden until the stream is actually playing", async ({ page }) => {
    await page.goto("/");

    // The fixture player never starts, so the control must not appear.
    await page.waitForTimeout(1500);
    await expect(page.locator("#soundToggle")).toBeHidden();
  });
});
