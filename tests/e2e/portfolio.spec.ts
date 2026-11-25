import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

const axeSource = fs.readFileSync(
  path.resolve(process.cwd(), "node_modules/axe-core/axe.min.js"),
  "utf8"
);

const viewports = [
  { name: "xs-320", width: 320, height: 720 },
  { name: "mobile-360", width: 360, height: 800 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1024", width: 1024, height: 768 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "wide-1920", width: 1920, height: 1080 },
];

test.describe("Portfolio E2E, Accessibility & Resilience", () => {
  test("homepage renders identity, 6 flagship projects, quality switcher, and visible below-the-fold content without scroll traps", async ({
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

    // Selected Work shows 6 flagship case studies initially
    const workSection = page.locator("#work");
    await expect(workSection).toBeVisible();
    await expect(workSection.locator("article")).toHaveCount(6);

    // Ensure contact section at bottom is immediately rendered at opacity 1 without scroll locks
    const contactOpacity = await page
      .locator("#contact")
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(contactOpacity)).toBe(1);

    // Real images load with non-zero naturalWidth after scrolling into view
    const images = workSection.locator("img");
    const imgCount = await images.count();
    expect(imgCount).toBe(6);
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

  test("homepage enforces V4 editorial IA sequence and renders Berijalan work strictly as non-interactive Experience info", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Standalone Enterprise Work section has been removed cleanly
    await expect(page.locator("#enterprise-work")).toHaveCount(0);

    const orderedIds = [
      "hero",
      "work",
      "project-explorer",
      "experience",
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

    // Selected projects under Berijalan contain all 3 initiatives with zero clickable links or buttons
    const selectedProjectsList = page.locator('[aria-label="Selected projects at Berijalan Techno Center"]');
    await expect(selectedProjectsList).toContainText("Archer Upgrade");
    await expect(selectedProjectsList).toContainText("STNK Alignment");
    await expect(selectedProjectsList).toContainText("Advanced Joint Finance Parameter");
    await expect(selectedProjectsList.locator("a, button")).toHaveCount(0);

    // Chibi workstation illustration renders cleanly in #about without clipping or broken load
    const chibiImg = page.locator('#about img[alt*="Illustrated chibi portrait"]');
    await chibiImg.scrollIntoViewIfNeeded();
    await expect
      .poll(async () =>
        chibiImg.evaluate((el: HTMLImageElement) => (el.complete ? el.naturalWidth : 0))
      )
      .toBeGreaterThan(0);

    await expect(page.getByText(/DEMAND RENDERED/i)).toHaveCount(0);
    await expect(page.getByText(/All 73 Projects/i)).toHaveCount(0);
  });

  test("projects page opens with V4 framing, hides removed enterprise routes, and strips dead Live Demo actions", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/projects/", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toHaveText("Projects.");
    await expect(page.getByRole("tab", { name: /^Professional$/i })).toHaveCount(0);
    await expect(
      page.getByText(/ENGAGEMENT ORIGIN|ALL ELIGIBLE|STATIC SNAPSHOT SYNCED|REPOSITORY CATALOG|ENGINEERING PROJECT EXPLORER|ENGINEERING DOMAIN/i)
    ).toHaveCount(0);

    const firstCardBox = await page.locator("article").first().boundingBox();
    expect(firstCardBox).toBeTruthy();
    expect(firstCardBox!.y).toBeLessThan(860);

    const search = page.getByLabel("Search projects");
    await search.fill("cypress");
    await expect(page.getByText(/EverShop Cypress/i)).toBeVisible();

    // TechnoLoyaltyProgram must not show a dead sslip.io Live Demo link
    await search.fill("Berijalan Employee Loyalty Portal");
    const technoCard = page.locator("article").filter({ hasText: "Berijalan Employee Loyalty Portal" }).first();
    await expect(technoCard).toBeVisible();
    await expect(technoCard.getByRole("link", { name: /Live Demo/i })).toHaveCount(0);
    await expect(technoCard.getByRole("link", { name: /GitHub/i })).toHaveCount(1);

    await search.fill("nonexistent-xyz-999");
    await expect(page.getByText(/No matching projects found/i)).toBeVisible();
    await page.getByRole("button", { name: /Reset all filters/i }).click();

    await page.getByRole("button", { name: /^Filters/i }).click();
    await page.getByRole("tab", { name: /^Archive/i }).click();
    await expect(page.getByText(/HeartRateMonitor \(Extended Fork\)/i)).toBeVisible();
    await expect(page.getByText(/aditydcp\/sample-wear-phone-app/i)).toBeVisible();

    await page.getByRole("button", { name: /^Index$/i }).click();
    await expect(page.getByRole("link", { name: /Open case study for HeartRateMonitor/i })).toBeVisible();
  });

  test("all images across homepage and projects catalog load with valid dimensions", async ({
    page,
  }) => {
    const collectImageStates = async (selector: string) =>
      page.evaluate(async (sel) => {
        const imgs = Array.from(document.querySelectorAll<HTMLImageElement>(sel));
        for (const img of imgs) {
          img.scrollIntoView({ behavior: "instant", block: "center" });
          await new Promise((r) => requestAnimationFrame(r));
        }
        return Promise.all(
          imgs.map(
            (img) =>
              new Promise<{ src: string | null; complete: boolean; naturalWidth: number }>(
                (resolve) => {
                  const done = () =>
                    resolve({
                      src: img.getAttribute("src"),
                      complete: img.complete,
                      naturalWidth: img.naturalWidth,
                    });
                  if (img.complete && img.naturalWidth > 0) {
                    done();
                    return;
                  }
                  const timer = window.setTimeout(done, 8000);
                  img.addEventListener(
                    "load",
                    () => {
                      window.clearTimeout(timer);
                      done();
                    },
                    { once: true }
                  );
                  img.addEventListener(
                    "error",
                    () => {
                      window.clearTimeout(timer);
                      done();
                    },
                    { once: true }
                  );
                }
              )
          )
        );
      }, selector);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "load" });
    const homeResults = await collectImageStates("img");
    expect(homeResults.length).toBeGreaterThanOrEqual(7);
    for (const r of homeResults) {
      expect(r.complete && r.naturalWidth > 0, `Homepage image failed: ${JSON.stringify(r)}`).toBe(true);
    }

    await page.goto("/projects/", { waitUntil: "load" });
    const catalogResults = await collectImageStates("article img");
    expect(catalogResults.length).toBeGreaterThanOrEqual(10);
    for (const r of catalogResults) {
      expect(r.complete && r.naturalWidth > 0, `Catalog image failed: ${JSON.stringify(r)}`).toBe(true);
    }
  });

  test("RollText links keep visible text inside container bounds on hover", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });

    const targets = [
      page.locator("#hero").getByRole("link", { name: /Get in Touch/i }),
      page.locator("#hero").getByRole("link", { name: /GitHub/i }),
      page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Work" }),
    ];

    for (const loc of targets) {
      await loc.hover();
      await page.waitForTimeout(350);
      const result = await loc.evaluate((el) => {
        const container = el.querySelector(".roll-text");
        const clone = el.querySelector(".roll-text-clone");
        if (!container || !clone) return { ok: false, reason: "missing roll-text elements" };
        const cr = container.getBoundingClientRect();
        const cl = clone.getBoundingClientRect();
        const visibleInBounds =
          cl.top >= cr.top - 2 &&
          cl.bottom <= cr.bottom + 2 &&
          cl.height > 8;
        return { ok: visibleInBounds, crTop: cr.top, crBottom: cr.bottom, clTop: cl.top, clBottom: cl.bottom };
      });
      expect(result.ok, `RollText clone must stay visible inside bounds on hover: ${JSON.stringify(result)}`).toBe(true);
    }
  });

  test("internal Berijalan enterprise routes are excluded from public static export", async ({ request }) => {
    for (const slug of ["archer-upgrade", "stnk-alignment", "advanced-joint-finance-parameter"]) {
      const res = await request.get(`/projects/${slug}/`);
      expect(res.status()).toBe(404);
    }
  });

  test("all interactive controls respond to real user clicks without WebGL/cursor obstruction", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });

    // 1. Hero CTAs work via genuine user clicks
    await page.locator("#hero").getByRole("link", { name: /View My Work/i }).click();
    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(250);

    // 2. Brand logo returns cleanly to top of homepage (TC-FUNC-001)
    await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: /Adrian Syah Abidin home/i }).click();
    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeLessThan(80);

    // 3. Copy email button copies address and displays feedback (TC-FUNC-007)
    const copyBtn = page.locator("#contact").getByRole("button", { name: /adriansyah1230@gmail\.com/i });
    await copyBtn.scrollIntoViewIfNeeded();
    await copyBtn.click();
    await expect(page.locator("#contact").getByText(/Copied address/i)).toBeVisible();

    // 4. Footer Back to top button works cleanly
    const backToTop = page.getByRole("button", { name: /Back to top/i });
    await backToTop.scrollIntoViewIfNeeded();
    await backToTop.click();
    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeLessThan(80);

    // 5. Verified Live Demo external link metadata on Featured project (TC-FUNC-010)
    const demoLink = page.locator("#work").getByRole("link", { name: /Live demo for HSK 1 Vocabulary Master/i });
    await expect(demoLink).toHaveAttribute("href", "https://hsk1vocab.edgeone.dev/");
    await expect(demoLink).toHaveAttribute("target", "_blank");
    await expect(demoLink).toHaveAttribute("rel", /noopener/);

    // 6. Top nav link to /projects/ + Case study + browser Back/Forward (TC-FUNC-009, TC-FUNC-014, TC-FUNC-015)
    await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/\/projects\/?$/);
    await expect(page.locator("h1")).toHaveText("Projects.");

    await page.getByRole("link", { name: "AutomatePlus" }).first().click();
    await expect(page).toHaveURL(/\/projects\/automate-plus\/?$/);
    await expect(page.locator("h1")).toHaveText("AutomatePlus");
    await page.goBack();
    await expect(page).toHaveURL(/\/projects\/?$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/projects\/automate-plus\/?$/);

    // 7. Clicking brand logo from subpage navigates back to homepage
    await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: /Adrian Syah Abidin home/i }).click();
    await expect(page).toHaveURL(/\/$/);

    // 8. Mobile drawer link navigates without returning focus back to header toggle
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Open navigation menu/i }).click();
    const drawer = page.locator("#mobile-nav-drawer");
    await expect(drawer).toBeVisible();
    await drawer.getByRole("link", { name: /Experience/i }).click();
    await expect(drawer).toBeHidden();
    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
  });

  test("technical SEO tags, canonical URLs, JSON-LD, OG image, sitemap, and robots.txt are valid", async ({
    page,
    request,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page).toHaveTitle("Adrian Syah Abidin | Software & QA Automation Engineer");
    await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://adriansyahabidin.vercel.app/"
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /\/og-image\.png$/
    );

    const homeLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(homeLd).toBeTruthy();
    const parsedHome = JSON.parse(homeLd!);
    expect(JSON.stringify(parsedHome)).toContain("ProfilePage");
    expect(JSON.stringify(parsedHome)).toContain("Person");
    expect(JSON.stringify(parsedHome)).not.toContain("worksFor");

    await page.goto("/projects/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://adriansyahabidin.vercel.app/projects/"
    );

    const ogRes = await request.get("/og-image.png");
    expect(ogRes.status()).toBe(200);
    expect(ogRes.headers()["content-type"]).toContain("image/png");

    const robotsRes = await request.get("/robots.txt");
    expect(robotsRes.status()).toBe(200);
    expect(await robotsRes.text()).toContain("https://adriansyahabidin.vercel.app/sitemap.xml");

    const sitemapRes = await request.get("/sitemap.xml");
    expect(sitemapRes.status()).toBe(200);
    const sitemapText = await sitemapRes.text();
    expect(sitemapText).toContain("https://adriansyahabidin.vercel.app/");
    expect(sitemapText).toContain("https://adriansyahabidin.vercel.app/projects/automate-plus/");
    expect(sitemapText).not.toContain("archer-upgrade");
    expect(sitemapText).not.toContain("stnk-alignment");
    expect(sitemapText).not.toContain("advanced-joint-finance-parameter");
  });

  test("personal detail routes resolve cleanly on static reload and preserve fork credit", async ({
    page,
  }) => {
    await page.goto("/projects/automate-plus/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toHaveText("AutomatePlus");
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toHaveText("AutomatePlus");

    await page.goto("/projects/heart-rate-monitor/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toContainText("HeartRateMonitor");
    const forkBox = page.locator("section").filter({ hasText: /Fork Attribution & Contribution Boundary/i });
    await expect(forkBox).toBeVisible();
    await expect(forkBox).toContainText(/aditydcp\/sample-wear-phone-app/i);

    await page.goto("/projects/project-game/", { waitUntil: "domcontentloaded" });
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

  test("reduced-motion preference and runtime quality switcher render static geometric fallback", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.getByText(/REDUCED MOTION · STATIC GEOMETRY/i)).toBeAttached();
    await expect(page.locator("canvas")).toHaveCount(0);

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /^Reduced$/i }).click();
    await expect(page.getByText(/REDUCED MOTION · STATIC GEOMETRY/i)).toBeAttached();
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
    await expect(page.getByText(/WEBGL FALLBACK/i)).toBeAttached();
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

      await page.goto("/projects/automate-plus/", { waitUntil: "networkidle" });
      const overflowDetail = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflowDetail).toBe(false);
    });
  }

  for (const route of [
    "/",
    "/projects/",
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
