import { test, expect, clickMapNode, currentZoom } from "./fixtures.js";

const PLANETS = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];

test.describe("solar system", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#atlas").scrollIntoViewIfNeeded();
  });

  test("lists all eight planets in order from the Sun", async ({ page }) => {
    const titles = await page
      .locator(".map-node:not(.map-node--deep-space)")
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => node.querySelector(".map-node__order"))
          .map((node) => node.querySelector(".map-node__label strong").textContent.trim()),
      );

    expect(titles).toEqual(PLANETS.map((name, index) => `${String(index + 1).padStart(2, "0")} ${name}`));
  });

  test("distances increase outward and every orbit is larger than the last", async ({ page }) => {
    const distances = await page
      .locator(".map-node__label small")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.textContent.trim()).filter((text) => text.endsWith(" AU")).map(parseFloat),
      );

    expect(distances).toHaveLength(8);
    expect([...distances].sort((a, b) => a - b)).toEqual(distances);
  });

  test("planets use photographic textures that load", async ({ page }) => {
    const textured = page.locator(".map-node--textured");
    await expect(textured).toHaveCount(9);

    const urls = await textured.evaluateAll((nodes) =>
      nodes.map((node) => node.style.getPropertyValue("--texture").match(/url\((.+)\)/)[1]),
    );

    for (const url of urls) {
      const response = await page.request.get(url);
      expect(response.ok(), url).toBeTruthy();
      expect(response.headers()["content-type"]).toMatch(/image\/(jpeg|png)/);
    }
  });

  test("planets move at different speeds (inner fastest)", async ({ page }) => {
    const read = () =>
      page.evaluate(() =>
        Object.fromEntries(
          ["mercury", "neptune"].map((id) => {
            const node = document.querySelector(`.map-node[data-node-id="${id}"]`);
            return [id, [parseFloat(node.style.left), parseFloat(node.style.top)]];
          }),
        ),
      );

    const before = await read();
    await page.waitForTimeout(2000);
    const after = await read();
    const moved = (id) => Math.hypot(after[id][0] - before[id][0], after[id][1] - before[id][1]);

    expect(moved("mercury")).toBeGreaterThan(moved("neptune") * 3);
  });

  test("clicking a planet zooms in on it and shows its facts", async ({ page }) => {
    await clickMapNode(page, "jupiter");

    await expect(page.locator(".canvas-frame")).toHaveClass(/is-zoomed/);
    await expect(page.locator("#zoomOutButton")).toBeVisible();
    await expect.poll(() => currentZoom(page)).toBeGreaterThan(4);

    await expect(page.locator("#selectionTitle")).toHaveText("Jupiter");
    await expect(page.locator("#selectionFacts")).toContainText("139,820 km");
    await expect(page.locator("#selectionFacts")).toContainText("5.20 AU");
    await expect(page.locator("#galleryTitle")).toHaveText("Photos of Jupiter");

    // Zoomed in, the planet switches to its high-resolution photo.
    await expect(page.locator('.map-node[data-node-id="jupiter"]')).toHaveClass(/is-detailed/);
  });

  test("the zoomed planet stays inside the visible area", async ({ page }) => {
    await clickMapNode(page, "mars");
    await expect.poll(() => currentZoom(page)).toBeGreaterThan(4);
    await page.waitForTimeout(1300);

    const box = await page.locator('.map-node[data-node-id="mars"] .map-node__body').boundingBox();
    const frame = await page.locator(".canvas-frame").boundingBox();
    const card = await page.locator(".map-hud > div").first().boundingBox();
    const back = await page.locator("#zoomOutButton").boundingBox();

    expect(box.x).toBeGreaterThanOrEqual(frame.x);
    expect(box.x + box.width).toBeLessThanOrEqual(frame.x + frame.width);
    expect(box.y).toBeGreaterThanOrEqual(back.y + back.height - 1);

    // On phones the info card spans the width, so the planet must sit above it.
    if (card.width > frame.width * 0.7) {
      expect(box.y + box.height).toBeLessThanOrEqual(card.y + 1);
    }
  });

  test("Back button, Escape and clicking empty space all zoom out", async ({ page }) => {
    const zoomIn = async () => {
      await clickMapNode(page, "saturn");
      await expect.poll(() => currentZoom(page)).toBeGreaterThan(2);
    };
    const expectOverview = async () => {
      await expect(page.locator(".canvas-frame")).not.toHaveClass(/is-zoomed/);
      await expect.poll(() => currentZoom(page)).toBeLessThan(1.01);
      await expect(page.locator("#zoomOutButton")).toBeHidden();
    };

    await zoomIn();
    await page.locator("#zoomOutButton").click();
    await expectOverview();

    await zoomIn();
    await page.keyboard.press("Escape");
    await expectOverview();

    await zoomIn();
    await page.locator("#mapOverlay").dispatchEvent("click");
    await expectOverview();
  });

  test("deep-sky objects show the overview with their facts", async ({ page }) => {
    await clickMapNode(page, "mars");
    await expect.poll(() => currentZoom(page)).toBeGreaterThan(2);

    await page.locator('.rail-chip[data-node-id="andromeda"]').click();
    await expect.poll(() => currentZoom(page)).toBeLessThan(1.01);
    await expect(page.locator("#selectionFacts")).toContainText("2.5M light-years");
    await expect(page.locator("#selectionFacts")).toContainText("Spiral galaxy");
  });

  test("changing the selection never moves or resizes the overview", async ({ page }) => {
    const measure = () =>
      page.evaluate(() => {
        // Relative to the map, so page scrolling doesn't count as movement.
        const frame = document.querySelector(".canvas-frame").getBoundingClientRect();
        const sun = document.querySelector(".sun-anchor").getBoundingClientRect();
        return { x: sun.x + sun.width / 2 - frame.x, y: sun.y + sun.height / 2 - frame.y };
      });

    const before = await measure();
    // Deep-sky objects show fewer facts, so the info card changes height.
    await page.locator('.rail-chip[data-node-id="andromeda"]').click();
    await expect(page.locator("#selectionFacts > div")).toHaveCount(2);
    await page.waitForTimeout(300);
    const after = await measure();

    expect(Math.abs(after.x - before.x)).toBeLessThan(1);
    expect(Math.abs(after.y - before.y)).toBeLessThan(1);
  });

  test("the destination bar lists planets in order and selects them", async ({ page }) => {
    const numbered = await page
      .locator(".rail-chip .rail-order")
      .evaluateAll((spans) => spans.map((span) => span.parentElement.textContent.trim()));
    expect(numbered).toEqual(PLANETS.map((name, index) => `${String(index + 1).padStart(2, "0")}${name}`));

    await page.locator('.rail-chip[data-node-id="neptune"]').click();
    await expect(page.locator('.rail-chip[data-node-id="neptune"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#selectionTitle")).toHaveText("Neptune");
  });

  test("animation keeps a smooth frame rate", async ({ page }) => {
    const medianFrameMs = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const times = [];
          let last = performance.now();
          const start = last;
          const tick = (now) => {
            times.push(now - last);
            last = now;
            if (now - start < 2000) {
              requestAnimationFrame(tick);
            } else {
              times.sort((a, b) => a - b);
              resolve(times[Math.floor(times.length / 2)]);
            }
          };
          requestAnimationFrame(tick);
        }),
    );

    // Median frame within ~30 fps even on a busy CI machine.
    expect(medianFrameMs).toBeLessThan(34);
  });
});
