import { test, expect } from "@playwright/test";

// Checks for the local dev server only; the deployed site is served by Cloudflare.
test.describe("dev server", () => {
  test.skip(({ baseURL }) => !/127\.0\.0\.1|localhost/.test(baseURL), "Local server checks only");

  test("answers malformed URLs with 400 and keeps running", async ({ request }) => {
    const bad = await request.get("/%E0%A4%A");
    expect(bad.status()).toBe(400);

    const ok = await request.get("/");
    expect(ok.ok()).toBeTruthy();
  });

  test("refuses paths outside the project, including look-alike sibling folders", async ({ request }) => {
    for (const path of ["/..%2Fpackage.json", "/..%2FSolarSystem-backup%2Fsecret.txt", "/%2E%2E/%2E%2E/Windows/win.ini"]) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(404);
    }
  });
});
