import { test, expect } from "./fixtures.js";

// No photo may be drawn larger than the resolution of the file the browser
// chose for it (using the widths NASA declares in each srcset entry).
async function measureUpscale(locator) {
  return locator.evaluateAll((images) =>
    images
      .filter((image) => image.complete && image.currentSrc && image.srcset)
      .map((image) => {
        const box = image.getBoundingClientRect();
        const candidates = image.srcset.split(",").map((entry) => {
          const [url, descriptor] = entry.trim().split(/\s+/);
          return { url, width: parseInt(descriptor, 10) };
        });
        const chosen = candidates.find((candidate) => candidate.url === image.currentSrc);
        const best = Math.max(...candidates.map((candidate) => candidate.width));
        const aspect = image.naturalWidth / image.naturalHeight || 1;
        // object-fit: cover needs enough width to also fill the height.
        const needed = Math.max(box.width, box.height * aspect) * devicePixelRatio;

        return {
          src: image.currentSrc.split("/").pop(),
          chosenWidth: chosen ? chosen.width : 0,
          bestWidth: best,
          needed: Math.round(needed),
        };
      }),
  );
}

test.describe("image sharpness", () => {
  test("gallery photos are never upscaled when a sharper version exists", async ({ page }) => {
    await page.goto("/");
    await page.locator("#gallery").scrollIntoViewIfNeeded();
    await expect(page.locator("#galleryGrid .gallery-card")).toHaveCount(12);

    // Bring every card into view so lazy images load.
    for (const card of await page.locator("#galleryGrid .gallery-card").all()) {
      await card.scrollIntoViewIfNeeded();
    }
    await page.waitForTimeout(500);

    const rows = await measureUpscale(page.locator("#galleryGrid img"));
    expect(rows.length).toBeGreaterThan(0);

    for (const row of rows) {
      // Either the chosen file is big enough, or it is already the largest NASA offers.
      const sharp = row.chosenWidth >= row.needed * 0.95 || row.chosenWidth === row.bestWidth;
      expect(sharp, JSON.stringify(row)).toBeTruthy();
    }
  });

  test("every planet has a small and a high-resolution photo", async ({ page, request }) => {
    await page.goto("/");

    const sources = await page.locator(".map-node--textured").evaluateAll((nodes) =>
      nodes.flatMap((node) =>
        ["--texture", "--texture-hi"].map((name) => node.style.getPropertyValue(name).match(/url\((.+)\)/)[1]),
      ),
    );
    expect(sources).toHaveLength(18);

    for (const source of sources) {
      const response = await request.get(source);
      expect(response.ok(), source).toBeTruthy();
    }
  });

  test("the shared link preview image exists", async ({ page, request }) => {
    await page.goto("/");
    const image = await page.locator('meta[property="og:image"]').getAttribute("content");
    const response = await request.get(new URL(image).pathname);
    expect(response.ok()).toBeTruthy();
  });
});
