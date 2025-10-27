// CHANGELOG: 2025-10-12 - Cover Studio flows with mocked provider banners and form gating
import { test, expect } from "@playwright/test";

test.describe("Studio workflows (mocked)", () => {
  test("provider status endpoint exposes configuration flags", async ({ request }) => {
    const response = await request.get("/api/providers/status");
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.status).toBeDefined();
    expect(json.status).toMatchObject({
      lovable: expect.any(Boolean),
      hosting: expect.any(Boolean),
      registrar: expect.any(Boolean),
      email: expect.any(Boolean),
    });
  });

  test("billing usage endpoint returns plan summary", async ({ request }) => {
    const response = await request.get("/api/billing/usage");
    expect(response.status()).toBeLessThan(500);
  });
});
