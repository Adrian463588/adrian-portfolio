import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

const axeSource = fs.readFileSync(
  path.resolve(process.cwd(), "node_modules/axe-core/axe.min.js"),
  "utf8"
);

const viewports = [
  { name: "xs-320", width: 320, height: 720 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1024", width: 1024, height: 768 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "wide-1920", width: 1920, height: 1080 },
];

test.describe("Portfolio E2E, Accessibility & Resilience", () => {
  test("homepage renders identity, 8 featured projects, and visible below-the-fold content without scroll traps", async ({
    page,
  }) => {
    const errors: string[] = [];
    const failedAssets: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("response", (res) => {
      if (res.status() >= 400) failedAssets.push(`${res.status()} ${res.url()}`);
    });

    await page.goto("/", { waitUntil: "networkidle" });

    const h1 = page.locator("h1");
    await expect(h1).toHaveText("Adrian Syah Abidin");

    // Selected Work shows 8 featured case studies
    const workSection = page.locator("#work");
    await expect(workSection).toBeVisible();
    await expect(workSection.locator("article")).toHaveCount(8);

    // Ensure contact section at bottom is immediately rendered at opacity 1 without scroll locks
    const contactOpacity = await page
      .locator("#contact")
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(contactOpacity)).toBe(1);

    // Real images load with non-zero naturalWidth after scrolling into view
    const images = workSection.locator("img");
    const imgCount = await images.count();
    expect(imgCount).toBe(8);
    for (let i = 0; i < imgCount; i++) {
      const img = images.nth(i);
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(async () => img.evaluate((el: HTMLImageElement) => (el.complete ? el.naturalWidth : 0)))
        .toBeGreaterThan(0);
    }

    // External links use rel=noopener noreferrer
    const externalLinks = page.locator('a[target="_blank"]');
    const extCount = await externalLinks.count();
    expect(extCount).toBeGreaterThan(5);
    for (let i = 0; i < extCount; i++) {
      const rel = await externalLinks.nth(i).getAttribute("rel");
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    }

    expect(failedAssets).toEqual([]);
    expect(errors).toEqual([]);
  });

  test("experience tabs show grouped Berijalan roles first and separate work from bootcamps", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const expSection = page.locator("#experience");
    await expect(expSection.getByRole("tab", { name: /Work Experience/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(expSection.locator("article")).toHaveCount(4);

    const berijalanCard = expSection.locator("article").first();
    await expect(berijalanCard).toContainText("Berijalan Techno Center");
    await expect(berijalanCard).toContainText("PT Cipta Sedaya Digital Indonesia");
    await expect(berijalanCard).toContainText("Astra Credit Companies (ACC) Group");
    await expect(berijalanCard).toContainText("Software Quality Control Engineer — Freelance");
    await expect(berijalanCard).toContainText("Jul 2026 – Oct 2026");
    await expect(berijalanCard).toContainText("Software Quality Control Engineer Trainee");
    await expect(berijalanCard).toContainText("Bootcamp / Internship-equivalent");
    await expect(berijalanCard).toContainText("Mar 2026 – Jul 2026");
    await expect(berijalanCard).not.toContainText(/Present/i);

    await expSection.getByRole("tab", { name: /Bootcamps & Training/i }).click();
    await expect(expSection.locator("article")).toHaveCount(8);

    await expSection.getByRole("tab", { name: /^All \(/i }).click();
    await expect(expSection.locator("article")).toHaveCount(12);
  });

  test("homepage enforces V2 IA sequence and renders 3 sanitized Enterprise Case Studies", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const orderedIds = [
      "hero",
      "experience",
      "enterprise-work",
      "work",
      "project-explorer",
      "competencies",
      "certifications",
      "education",
      "about",
      "contact",
    ];
    let prevY = -1;
    for (const id of orderedIds) {
      const box = await page.locator(`#${id}`).boundingBox();
      expect(box, `Section #${id} must exist and be visible`).toBeTruthy();
      expect(box!.y).toBeGreaterThan(prevY);
      prevY = box!.y;
    }

    const enterpriseSection = page.locator("#enterprise-work");
    await expect(enterpriseSection.locator("article")).toHaveCount(3);
    await expect(enterpriseSection).toContainText("Archer Upgrade");
    await expect(enterpriseSection).toContainText("STNK Alignment");
    await expect(enterpriseSection).toContainText("Advanced Joint Finance Parameter");
    await expect(enterpriseSection.locator("img")).toHaveCount(0);
    await expect(enterpriseSection.getByRole("link", { name: /GitHub/i })).toHaveCount(0);
  });

  test("project explorer search, origin filters, empty state, reset, and archive fork attribution", async ({
    page,
  }) => {
    await page.goto("/projects/", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toHaveText("Engineering Project Explorer");

    await page.getByRole("button", { name: /Professional Work \(3\)/i }).click();
    await expect(page.getByText(/Showing 3 of/i)).toBeVisible();
    await expect(page.getByText(/Archer Upgrade/i)).toBeVisible();
    await page.getByRole("button", { name: /Clear filters/i }).click();

    const search = page.getByLabel("Search Projects");
    await search.fill("cypress");
    await expect(page.getByText(/EverShop Cypress/i)).toBeVisible();

    await search.fill("nonexistent-xyz-999");
    await expect(page.getByText(/No matching engineering projects found/i)).toBeVisible();
    await page.getByRole("button", { name: /Reset all filters/i }).click();

    await page.getByRole("tab", { name: /Experiments & Archive/i }).click();
    await expect(page.getByText(/HeartRateMonitor \(Extended Fork\)/i)).toBeVisible();
    await expect(page.getByText(/aditydcp\/sample-wear-phone-app/i)).toBeVisible();
  });

  test("enterprise and personal detail routes resolve cleanly on static reload", async ({
    page,
  }) => {
    for (const slug of [
      "archer-upgrade",
      "stnk-alignment",
      "advanced-joint-finance-parameter",
    ]) {
      await page.goto(`/projects/${slug}/`, { waitUntil: "networkidle" });
      await page.reload({ waitUntil: "networkidle" });
      await expect(page.getByRole("link", { name: /View GitHub Repository/i })).toHaveCount(0);
      await expect(page.getByText(/Illustrative · Non-Proprietary/i)).toBeVisible();
      await expect(page.getByRole("link", { name: /Associated Experience/i })).toBeVisible();
    }

    await page.goto("/projects/stnk-alignment/", { waitUntil: "networkidle" });
    await expect(page.locator("article")).toContainText("Magic xpa");
    await expect(page.locator("article")).toContainText("AOL UniPaaS");

    await page.goto("/projects/advanced-joint-finance-parameter/", { waitUntil: "networkidle" });
    await expect(page.locator("article")).toContainText("Joint Financing");
    await page.goto("/projects/automate-plus/", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toHaveText("AutomatePlus");
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("h1")).toHaveText("AutomatePlus");

    await page.goto("/projects/heart-rate-monitor/", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("HeartRateMonitor");
    const forkBox = page.locator("section").filter({ hasText: /Fork Attribution & Contribution Boundary/i });
    await expect(forkBox).toBeVisible();
    await expect(forkBox).toContainText(/aditydcp\/sample-wear-phone-app/i);

    await page.goto("/projects/project-game/", { waitUntil: "networkidle" });
    await expect(page.getByText(/Unity \(C#\)/i)).toBeVisible();
    await expect(page.getByText(/2D side-scrolling/i).first()).toBeVisible();
    await expect(page.getByText(/Unreal Engine/i)).toHaveCount(0);
  });

  test("mobile menu opens, meets 44px touch targets, and restores focus on Escape", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "networkidle" });

    const menuBtn = page.getByRole("button", { name: /Open navigation menu/i });
    const box = await menuBtn.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);

    await menuBtn.click();
    const drawer = page.locator("#mobile-nav-drawer");
    await expect(drawer).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(page.getByRole("button", { name: /Open navigation menu/i })).toBeFocused();
  });

  test("keyboard navigation traverses skip link and primary controls", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    const skip = page.locator(".skip-link");
    await expect(skip).toBeFocused();
  });

  test("reduced-motion preference renders static geometric fallback", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.getByText(/REDUCED MOTION · STATIC GEOMETRY/i)).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
  });

  test("WebGL unavailable renders static fallback with zero uncaught errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.addInitScript(() => {
      const origGetContext = HTMLCanvasElement.prototype.getContext;
      // Force WebGL context acquisition to return null for graceful fallback verification
      HTMLCanvasElement.prototype.getContext = function (
        this: HTMLCanvasElement,
        type: string,
        ...args: unknown[]
      ) {
        if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
          return null;
        }
        return origGetContext.apply(this, [type, ...args] as Parameters<typeof origGetContext>);
      } as typeof HTMLCanvasElement.prototype.getContext;
    });

    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.getByText(/WEBGL FALLBACK/i)).toBeVisible();
    expect(errors).toEqual([]);
  });

  for (const vp of viewports) {
    test(`zero horizontal overflow at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "networkidle" });
      const overflowHome = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflowHome).toBe(false);

      await page.goto("/projects/", { waitUntil: "networkidle" });
      const overflowProjects = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflowProjects).toBe(false);

      await page.goto("/projects/archer-upgrade/", { waitUntil: "networkidle" });
      const overflowEnterprise = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflowEnterprise).toBe(false);
    });
  }

  for (const route of [
    "/",
    "/projects/",
    "/projects/archer-upgrade/",
    "/projects/stnk-alignment/",
    "/projects/advanced-joint-finance-parameter/",
    "/projects/automate-plus/",
    "/projects/heart-rate-monitor/",
  ]) {
    test(`axe-core WCAG 2.2 AA audit passes with zero violations on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });
      await page.addScriptTag({ content: axeSource });
      const results = await page.evaluate(async () => await (window as unknown as { axe: { run: () => Promise<{ violations: Array<{ id: string; impact: string; nodes: Array<{ target: string[] }> }> }> } }).axe.run());
      expect(results.violations).toEqual([]);
    });
  }
});
