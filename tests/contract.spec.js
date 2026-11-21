// Contract tests: call the real external services and check they still
// return what the site relies on. Unlike the rest of the suite these are NOT
// mocked, so they only run with CONTRACT=1 (npm run test:contract and the
// daily live-check workflow), never on every push.

import { test, expect } from "@playwright/test";

test.skip(!process.env.CONTRACT, "Real-API contract tests run with CONTRACT=1");
test.describe.configure({ retries: 1 });

test.describe("external API contracts", () => {
  test("NASA Image and Video Library search returns images with width metadata", async ({ request }) => {
    const response = await request.get("https://images-api.nasa.gov/search?q=Mars%20global&media_type=image&page_size=5");
    expect(response.status()).toBe(200);

    const items = (await response.json()).collection.items;
    expect(items.length).toBeGreaterThan(0);

    const item = items[0];
    expect(item.data[0]).toHaveProperty("nasa_id");
    expect(item.data[0]).toHaveProperty("title");
    // The srcset logic needs per-rendition widths.
    expect(item.links.some((link) => link.render === "image" && link.width > 0)).toBeTruthy();
  });

  test("NASA library lookup by id works for the spotlight fallbacks", async ({ request }) => {
    const response = await request.get("https://images-api.nasa.gov/search?nasa_id=PIA03515");
    expect(response.status()).toBe(200);
    const [item] = (await response.json()).collection.items;
    expect(item.data[0].nasa_id).toBe("PIA03515");
  });

  test("NASA APOD answers (or rate-limits the shared DEMO_KEY)", async ({ request }) => {
    const response = await request.get("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&thumbs=true");
    // APOD is often unavailable: 429 when the shared DEMO_KEY quota is used up,
    // 5xx when the service is down. The site falls back to archive images in
    // both cases, so record it as a warning rather than failing.
    const status = response.status();

    if (status === 429 || status >= 500) {
      test.info().annotations.push({ type: "warning", description: `APOD unavailable (HTTP ${status}); site uses its fallback` });
      return;
    }

    expect(status).toBe(200);

    if (response.status() === 200) {
      const apod = await response.json();
      expect(apod).toHaveProperty("title");
      expect(["image", "video", "other"]).toContain(apod.media_type);
    }
  });

  test("wheretheiss.at returns the ISS position", async ({ request }) => {
    const response = await request.get("https://api.wheretheiss.at/v1/satellites/25544");
    expect(response.status()).toBe(200);

    const position = await response.json();
    for (const field of ["latitude", "longitude", "altitude", "velocity", "visibility", "timestamp"]) {
      expect(position, field).toHaveProperty(field);
    }
    expect(position.altitude).toBeGreaterThan(300);
    expect(position.altitude).toBeLessThan(500);
  });

  test("NASA's ISS live stream still exists on YouTube", async ({ request }) => {
    const response = await request.get(
      "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ROboUHfPUrU&format=json",
    );
    expect(response.status()).toBe(200);
    expect((await response.json()).author_name).toBe("NASA");
  });

  test("ESA's ISS tracker page is reachable", async ({ request }) => {
    const response = await request.get("https://isstracker.spaceflight.esa.int/");
    expect(response.status()).toBe(200);
  });
});
