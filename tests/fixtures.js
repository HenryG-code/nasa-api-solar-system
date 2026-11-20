// Shared test setup: every external service the site calls is replaced with
// deterministic fixture data, so tests never depend on NASA rate limits, the
// ISS's real position, or YouTube/ESA being reachable.

import { test as base, expect } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
// Any NASA image request is answered with a real JPEG from the repo.
const SAMPLE_IMAGE = join(ROOT, "assets", "planets", "mars-hi.jpg");

export const ISS_POSITION = {
  name: "iss",
  id: 25544,
  latitude: 12.3456,
  longitude: -98.7654,
  altitude: 421.2,
  velocity: 27600.4,
  visibility: "daylight",
  footprint: 4500,
  timestamp: 1795200000,
  units: "kilometers",
};

export const APOD = {
  date: "2026-11-20",
  title: "Fixture Nebula",
  explanation: "A deterministic Astronomy Picture of the Day used by the test suite.",
  media_type: "image",
  url: "https://images-assets.nasa.gov/image/FIXTURE/FIXTURE~medium.jpg",
  hdurl: "https://images-assets.nasa.gov/image/FIXTURE/FIXTURE~orig.jpg",
  copyright: "Test Suite",
};

function link(id, variant, width, height, size) {
  return {
    href: `https://images-assets.nasa.gov/image/${id}/${id}~${variant}.jpg`,
    rel: variant === "thumb" ? "preview" : "alternate",
    render: "image",
    width,
    height,
    size,
  };
}

// One NASA Image Library search result.
export function libraryItem({ id, title, description = "", keywords = [], maxWidth = 1920 }) {
  const height = Math.round(maxWidth * 0.75);
  const links = [link(id, "thumb", Math.min(640, maxWidth), Math.round(Math.min(640, maxWidth) * 0.75), 60_000)];

  if (maxWidth >= 1280) {
    links.push(link(id, "medium", 1280, 960, 250_000));
  }

  if (maxWidth > 1280) {
    links.push(link(id, "large", maxWidth, height, 600_000));
  }

  return {
    href: `https://images-assets.nasa.gov/image/${id}/collection.json`,
    data: [
      {
        nasa_id: id,
        title,
        description: description || `${title}. Fixture image description.`,
        keywords,
        center: "JPL",
        date_created: "2020-01-01T00:00:00Z",
        media_type: "image",
      },
    ],
    links,
  };
}

// Search results for a destination: good images plus ones the site must
// filter out (too small, off-topic, duplicate titles).
export function searchResults(query, page) {
  const term = query.split(" ")[0];
  const items = [];

  for (let index = 0; index < 18; index += 1) {
    const n = (page - 1) * 18 + index + 1;
    items.push(
      libraryItem({
        id: `${term.toUpperCase()}-${n}`,
        title: `${term} global view ${n}`,
        keywords: [term, "planet", "global"],
        maxWidth: index % 3 === 0 ? 2400 : 1920,
      }),
    );
  }

  if (page === 1) {
    items.push(libraryItem({ id: `${term}-TINY`, title: `${term} tiny thumbnail`, keywords: [term], maxWidth: 400 }));
    items.push(libraryItem({ id: `${term}-ROVER`, title: `${term} rover selfie`, keywords: [term, "rover"] }));
    items.push(libraryItem({ id: `${term}-DUP`, title: `${term} global view 1`, keywords: [term, "planet"] }));
  }

  return {
    collection: {
      items,
      metadata: { total_hits: 54 },
      links: page < 3 ? [{ rel: "next", prompt: "Next", href: "next" }] : [],
    },
  };
}

export async function mockExternalServices(page) {
  // Third-party embeds: answer with an empty black page.
  const blank = { status: 200, contentType: "text/html", body: "<html><body style='background:#000'></body></html>" };
  await page.route(/youtube(-nocookie)?\.com|ytimg\.com|isstracker\.spaceflight\.esa\.int/, (route) =>
    route.fulfill(blank),
  );

  await page.route("https://api.wheretheiss.at/**", (route) => route.fulfill({ json: ISS_POSITION }));
  await page.route("https://api.nasa.gov/planetary/apod**", (route) => route.fulfill({ json: APOD }));
  await page.route("https://images-assets.nasa.gov/**", (route) =>
    route.fulfill({ path: SAMPLE_IMAGE, contentType: "image/jpeg" }),
  );

  await page.route("https://images-api.nasa.gov/search**", (route) => {
    const url = new URL(route.request().url());
    const nasaId = url.searchParams.get("nasa_id");

    if (nasaId) {
      return route.fulfill({
        json: { collection: { items: [libraryItem({ id: nasaId, title: `Archive image ${nasaId}`, maxWidth: 3800 })] } },
      });
    }

    const page = Number(url.searchParams.get("page") || 1);
    return route.fulfill({ json: searchResults(url.searchParams.get("q") || "space", page) });
  });
}

export const test = base.extend({
  // Uncaught page errors, collected so every test can assert there were none.
  pageErrors: async ({}, use) => {
    await use([]);
  },
  page: async ({ page, pageErrors }, use) => {
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await mockExternalServices(page);
    await use(page);
  },
});

export { expect };

// The solar system animates constantly, so map clicks are dispatched straight
// to the element instead of waiting for it to stop moving.
export async function clickMapNode(page, id) {
  await page.locator(`.map-node[data-node-id="${id}"]`).dispatchEvent("click");
}

export async function currentZoom(page) {
  return page.evaluate(() =>
    Number(getComputedStyle(document.querySelector(".canvas-frame")).getPropertyValue("--zoom") || 1),
  );
}
