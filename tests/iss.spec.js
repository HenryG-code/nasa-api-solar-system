import { test, expect } from "./fixtures.js";

test.describe("ISS tracker", () => {
  test("shows live telemetry from the position API", async ({ page }) => {
    await page.goto("/");
    await page.locator("#iss").scrollIntoViewIfNeeded();

    await expect(page.locator("#issLat")).toHaveText("12.35° N");
    await expect(page.locator("#issLon")).toHaveText("98.77° W");
    await expect(page.locator("#issAlt")).toHaveText("421 km");
    await expect(page.locator("#issSpeed")).toHaveText("27,600 km/h");
    await expect(page.locator("#issSun")).toHaveText("Daylight");
    await expect(page.locator("#issOrbits")).toHaveText(/^15\.\d$/);
    await expect(page.locator("#issUpdated")).toHaveText(/^Updated /);
  });

  test("header chip shows the station's speed and altitude", async ({ page, isMobile }) => {
    test.skip(isMobile, "The chip value is hidden on phones");
    await page.goto("/");
    await page.locator("#iss").scrollIntoViewIfNeeded();

    await expect(page.locator("#navIssValue")).toHaveText("27,600 km/h · 421 km");
  });

  test("only polls while the tracker is on screen", async ({ page }) => {
    let calls = 0;
    await page.route("https://api.wheretheiss.at/**", (route) => {
      calls += 1;
      return route.fulfill({ json: { latitude: 1, longitude: 1, altitude: 420, velocity: 27600, visibility: "daylight", timestamp: 1 } });
    });

    await page.goto("/");
    await page.waitForTimeout(2500);
    // At most the single hero day/night check while the tracker is off screen.
    expect(calls).toBeLessThanOrEqual(1);

    await page.locator("#iss").scrollIntoViewIfNeeded();
    await expect.poll(() => calls, { timeout: 8000 }).toBeGreaterThan(1);
  });

  test("ESA map renders at native size and only ever scales down", async ({ page }) => {
    await page.goto("/");
    await page.locator("#iss").scrollIntoViewIfNeeded();

    const map = page.locator(".iss-map");
    await expect
      .poll(() => map.evaluate((element) => getComputedStyle(element).getPropertyValue("--iss-scale")))
      .not.toBe("");

    const { scale, frameWidth, mapWidth } = await map.evaluate((element) => ({
      scale: Number(getComputedStyle(element).getPropertyValue("--iss-scale")),
      frameWidth: element.querySelector("iframe").getBoundingClientRect().width,
      mapWidth: element.getBoundingClientRect().width,
    }));

    expect(scale).toBeLessThanOrEqual(1);
    // The scaled widget fills its frame without spilling out.
    expect(Math.abs(frameWidth - mapWidth)).toBeLessThanOrEqual(2);
  });
});
