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

    // Selected Work shows 6 curated projects in V6 editorial order
    const workSection = page.locator("#work");
    await expect(workSection).toBeVisible();
    const workArticles = workSection.locator("article");
    await expect(workArticles).toHaveCount(6);

    const orderedHeadings = await workSection.locator("article h3").allInnerTexts();
    expect(orderedHeadings.map((t) => t.trim())).toEqual([
      "Android Stress Detection",
      "QuranPlus",
      "Coffee Creator",
      "AdzanPlus",
      "ParfumCreator",
      "AutomatePlus",
    ]);

    const flagshipCard = workArticles.first();
    await expect(flagshipCard).toContainText("Flagship Research");
    await expect(flagshipCard.getByRole("link", { name: /GitHub/i })).toHaveCount(1);

    const parfumCard = workArticles.nth(4);
    await expect(parfumCard).toContainText("ParfumCreator");
    await expect(parfumCard).not.toContainText(/PRIVATE REPOSITORY|PRIVATE OVERVIEW|SOURCE OMITTED/i);
    await expect(parfumCard.getByRole("link", { name: /Case Study/i })).toHaveAttribute(
      "href",
      "/projects/parfum-creator/"
    );
    const parfumGitHub = parfumCard.getByRole("link", { name: /GitHub/i });
    await expect(parfumGitHub).toHaveCount(1);
    await expect(parfumGitHub).toHaveAttribute("href", "https://github.com/Adrian463588/ParfumCreator");
    await expect(parfumCard.getByRole("link", { name: /Live Demo/i })).toHaveCount(0);

    // Ensure contact section at bottom is immediately rendered at opacity 1 without scroll locks
    const contactOpacity = await page
      .locator("#contact")
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(contactOpacity)).toBe(1);

    // Real images on all 6 featured projects load with non-zero naturalWidth after scrolling
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
    const chibiImg = page.locator('#about img[alt="Illustrated portrait of Adrian Syah Abidin."]');
    await chibiImg.scrollIntoViewIfNeeded();
    await expect
      .poll(async () =>
        chibiImg.evaluate((el: HTMLImageElement) => (el.complete ? el.naturalWidth : 0))
      )
      .toBeGreaterThan(0);

    // Branding uses Adrian. and personal location uses Indonesia without YOGYA / GMT+7
    await expect(
      page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: /Adrian — Home/i })
    ).toBeVisible();
    await expect(page.getByText("INDONESIA", { exact: true })).toBeVisible();
    await expect(page.locator("#about")).toContainText("Indonesia · Universitas Gadjah Mada");
    await expect(page.locator("#contact")).toContainText("Based in Indonesia.");
    for (const sel of ["header", "#about", "#contact", "footer"]) {
      await expect(page.locator(sel)).not.toContainText(/YOGYA|Yogyakarta|GMT\+7/i);
    }
    await expect(page.getByText(/DEMAND RENDERED/i)).toHaveCount(0);
    await expect(page.getByText(/All 73 Projects/i)).toHaveCount(0);
  });

  test("projects page opens with V5 framing, hides removed enterprise routes, and strips dead Live Demo actions", async ({
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
    await search.fill("Employee Loyalty Program Platform");
    const technoCard = page.locator("article").filter({ hasText: "Employee Loyalty Program Platform" }).first();
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
    expect(homeResults.length).toBe(7);
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

  test("RollText links keep visible text inside container bounds on hover, leave, and rapid sweep", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });

    const nav = page.getByRole("navigation", { name: "Primary navigation" });
    const targets = [
      page.locator("#hero").getByRole("link", { name: /Get in Touch/i }),
      page.locator("#hero").getByRole("link", { name: /GitHub/i }),
      page.locator("#hero").getByRole("link", { name: /LinkedIn/i }),
      page.locator("#hero").getByRole("link", { name: /Medium/i }),
      nav.getByRole("link", { name: "Work" }),
      nav.getByRole("link", { name: "Projects" }),
      nav.getByRole("link", { name: "Resources" }),
      nav.getByRole("link", { name: "Experience" }),
      nav.getByRole("link", { name: "About" }),
      nav.getByRole("link", { name: "Contact" }),
    ];

    for (const loc of targets) {
      await loc.hover();
      await page.waitForTimeout(340);
      const hovered = await loc.evaluate((el) => {
        const container = el.querySelector(".roll-text");
        const clone = el.querySelector(".roll-text-clone");
        if (!container || !clone) return { ok: false, reason: "missing roll-text elements" };
        const cr = container.getBoundingClientRect();
        const cl = clone.getBoundingClientRect();
        const opacity = parseFloat(getComputedStyle(clone).opacity || "1");
        const visibleInBounds =
          cl.top >= cr.top - 2 &&
          cl.bottom <= cr.bottom + 2 &&
          cl.height > 8 &&
          opacity > 0.9;
        return { ok: visibleInBounds, cr, cl, opacity };
      });
      expect(hovered.ok, `Hover clone hidden or clipped: ${JSON.stringify(hovered)}`).toBe(true);
    }

    // Move cursor to neutral space and verify primary label restores cleanly
    await page.mouse.move(20, 200);
    await page.waitForTimeout(340);
    const restored = await targets[0].evaluate((el) => {
      const container = el.querySelector(".roll-text");
      const primary = el.querySelector(".roll-text-primary");
      if (!container || !primary) return false;
      const cr = container.getBoundingClientRect();
      const pr = primary.getBoundingClientRect();
      return pr.top >= cr.top - 2 && pr.bottom <= cr.bottom + 2;
    });
    expect(restored).toBe(true);
  });

  test("custom VIEW cursor uses sharp native scale without blurring or covering text links", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });

    const workMedia = page.locator("[data-cursor='work']").first();
    await workMedia.scrollIntoViewIfNeeded();
    await workMedia.hover();
    await page.waitForTimeout(300);

    const viewBadge = page.getByTestId("cursor-view-badge");
    await expect(viewBadge).toBeVisible();
    const stats = await viewBadge.evaluate((el) => {
      const cs = getComputedStyle(el);
      const label = el.querySelector("span");
      const labelStyle = label ? getComputedStyle(label) : null;
      let scaleX = 1;
      if (cs.transform && cs.transform !== "none") {
        const m = new DOMMatrixReadOnly(cs.transform);
        scaleX = Math.hypot(m.a, m.b);
      }
      return {
        opacity: parseFloat(cs.opacity || "0"),
        filter: cs.filter,
        scaleX,
        fontSize: labelStyle ? parseFloat(labelStyle.fontSize) : 0,
        pointerEvents: getComputedStyle(el.parentElement!).pointerEvents,
      };
    });
    expect(stats.opacity).toBeGreaterThan(0.9);
    expect(stats.filter).toBe("none");
    expect(stats.scaleX).toBeLessThanOrEqual(1.01);
    expect(stats.fontSize).toBeGreaterThanOrEqual(11);
    expect(stats.pointerEvents).toBe("none");
  });

  test("ResilientImage displays intentional fallback cleanly when a project thumbnail fails to load", async ({
    page,
  }) => {
    await page.route("**/projects/automate-plus-workbench.webp", (route) =>
      route.fulfill({ status: 404, body: "Not Found" })
    );
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "load" });
    const fallback = page.locator("#work [data-image-fallback='true']").first();
    await fallback.scrollIntoViewIfNeeded();
    await expect(fallback).toBeVisible();
    await expect(fallback).toContainText("AutomatePlus");
  });

  test("all public project routes in sitemap return HTTP 200 cleanly and Berijalan stays excluded", async ({
    request,
  }) => {
    for (const slug of [
      "archer-upgrade",
      "stnk-alignment",
      "advanced-joint-finance-parameter",
      "android-wear-stress-assistant",
    ]) {
      const res = await request.get(`/projects/${slug}/`);
      expect(res.status()).toBe(404);
    }

    const sitemapXml = await (await request.get("/sitemap.xml")).text();
    const projectLocs = [...sitemapXml.matchAll(/<loc>https:\/\/adriansyahabidin\.vercel\.app(\/projects\/[^<]+\/)<\/loc>/g)].map(
      (m) => m[1]
    );
    expect(projectLocs.length).toBe(71);
    for (const pinned of [
      "/projects/android-stress-detection/",
      "/projects/quran-plus/",
      "/projects/coffee-creator/",
      "/projects/adzan-plus/",
      "/projects/parfum-creator/",
    ]) {
      expect(projectLocs).toContain(pinned);
    }

    for (const pathname of projectLocs) {
      const res = await request.get(pathname);
      expect(res.status(), `Public route ${pathname} must return 200`).toBe(200);
    }
  });

  test("all interactive controls respond to real user clicks and cross-page anchor navigation works", async ({
    page,
    context,
  }) => {
    test.slow();
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });

    // 1. Hero CTAs work via genuine user clicks
    await page.locator("#hero").getByRole("link", { name: /View My Work/i }).click();
    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(250);

    // 2. Brand logo returns cleanly to top of homepage (TC-NAV-001)
    await page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: /Adrian — Home/i })
      .click();
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

    // 5. Verified Live Demo external link metadata on Featured project
    await page.goto("/projects/hsk1-vocabulary-master/", { waitUntil: "domcontentloaded" });
    const demoLink = page.getByRole("link", { name: /Live Demo/i });
    await expect(demoLink).toHaveAttribute("href", "https://hsk1vocab.edgeone.dev/");
    await expect(demoLink).toHaveAttribute("target", "_blank");
    await expect(demoLink).toHaveAttribute("rel", /noopener/);

    // 6. Top nav link to /projects/ + Case study + browser Back/Forward
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

    // 7. Cross-page anchor link (#contact) from project detail reaches homepage contact section (TC-NAV-014)
    await page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Contact" })
      .click();
    await expect(page).toHaveURL(/\/#contact$/);
    await expect(page.locator("#contact")).toBeInViewport();

    // 8. Clicking brand logo from subpage navigates back to homepage
    await page.goto("/projects/automate-plus/", { waitUntil: "domcontentloaded" });
    await page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: /Adrian — Home/i })
      .click();
    await expect(page).toHaveURL(/\/$/);

    // 9. Mobile drawer link navigates without returning focus back to header toggle
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
    // Raw static HTML is readable by crawlers without executing WebGL or JS animations
    const rawHomeHtml = await (await request.get("/")).text();
    expect(rawHomeHtml).toContain("<html lang=\"en\"");
    expect(rawHomeHtml).toContain("Adrian Syah Abidin");
    expect(rawHomeHtml).toContain("Software &amp; QA Automation Engineer");
    expect(rawHomeHtml).toContain("Android Stress Detection");
    expect(rawHomeHtml).toContain("Berijalan Techno Center");
    expect(rawHomeHtml).not.toMatch(/noindex/i);

    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page).toHaveTitle("Adrian Syah Abidin | Software & QA Automation Engineer");
    await expect(page.locator("#hero")).toContainText("Software & QA Automation Engineer");
    await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "en_US");
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator('meta[name="google-site-verification"]')).toHaveAttribute(
      "content",
      "P4O6B5PWmL-5E0i5XRbfkOSaPcop92urgS2lk-IAZ5s"
    );
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
    const homeLdText = JSON.stringify(parsedHome);
    expect(homeLdText).toContain("ProfilePage");
    expect(homeLdText).toContain("Person");
    expect(homeLdText).toContain("WebSite");
    expect(homeLdText).toContain("AWS Certified Cloud Practitioner");
    expect(homeLdText).toContain("https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/");
    expect(homeLdText).toContain("https://medium.com/@adriansyah1230");
    expect(homeLdText).not.toContain("worksFor");
    expect(homeLdText).not.toContain("adriansyah1230@gmail.com");

    await page.goto("/projects/", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle("Engineering Projects | Adrian Syah Abidin");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://adriansyahabidin.vercel.app/projects/"
    );
    const projectsLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(projectsLd).toContain("CollectionPage");
    expect(projectsLd).toContain("https://adriansyahabidin.vercel.app/#person");

    await page.goto("/projects/android-stress-detection/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.getByText("Related Projects", { exact: true })).toBeVisible();
    await expect(
      page.locator("article footer").getByRole("link", { name: "QuranPlus", exact: true })
    ).toBeVisible();

    const ogRes = await request.get("/og-image.png");
    expect(ogRes.status()).toBe(200);
    expect(ogRes.headers()["content-type"]).toContain("image/png");

    const robotsRes = await request.get("/robots.txt");
    expect(robotsRes.status()).toBe(200);
    expect(robotsRes.headers()["content-type"]).toContain("text/plain");
    expect(await robotsRes.text()).toContain("https://adriansyahabidin.vercel.app/sitemap.xml");

    const sitemapRes = await request.get("/sitemap.xml");
    expect(sitemapRes.status()).toBe(200);
    expect(sitemapRes.headers()["content-type"]).toContain("xml");
    const sitemapText = await sitemapRes.text();
    expect(sitemapText).toContain("https://adriansyahabidin.vercel.app/");
    expect(sitemapText).toContain("https://adriansyahabidin.vercel.app/projects/android-stress-detection/");
    expect(sitemapText).toContain("https://adriansyahabidin.vercel.app/projects/parfum-creator/");
    expect(sitemapText).toContain("https://adriansyahabidin.vercel.app/projects/automate-plus/");
    expect(sitemapText).not.toContain("archer-upgrade");
    expect(sitemapText).not.toContain("stnk-alignment");
    expect(sitemapText).not.toContain("advanced-joint-finance-parameter");
  });

  test("personal detail routes resolve cleanly on static reload, enforce V6 flagship & private rules, and preserve fork credit", async ({
    page,
  }) => {
    test.slow();
    await page.goto("/projects/android-stress-detection/", { waitUntil: "networkidle" });
    await expect(page).toHaveTitle(/Android Stress Detection — PPG & Wear OS Research/);
    await expect(page.locator("h1")).toHaveText("Android Stress Detection");
    await expect(page.getByText("Flagship Research", { exact: true })).toBeVisible();
    await expect(page.locator("article")).toContainText(/not a medical diagnostic tool/i);
    const stressImgs = page.locator("article img");
    await expect(stressImgs).toHaveCount(2);
    for (let i = 0; i < 2; i++) {
      const img = stressImgs.nth(i);
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(async () => img.evaluate((el: HTMLImageElement) => (el.complete ? el.naturalWidth : 0)))
        .toBeGreaterThan(0);
    }

    await page.goto("/projects/parfum-creator/", { waitUntil: "networkidle" });
    await expect(page).toHaveTitle("ParfumCreator — Android Perfume Formulation App | Adrian Syah Abidin");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "Explore ParfumCreator, an Android application for perfume formulation, fragrance blending, and recipe development, built with Kotlin and Jetpack Compose."
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://adriansyahabidin.vercel.app/projects/parfum-creator/"
    );
    const parfumLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(parfumLd).toContain("SoftwareSourceCode");
    expect(parfumLd).toContain("https://github.com/Adrian463588/ParfumCreator");
    await expect(page.locator("h1")).toHaveText("ParfumCreator");
    await expect(page.getByText("Private Repository", { exact: true })).toHaveCount(0);
    await expect(page.locator("article")).not.toContainText(/PRIVATE OVERVIEW|SOURCE OMITTED|Private summary/i);
    await expect(page.locator("article").getByRole("link", { name: /Source code/i })).toHaveAttribute(
      "href",
      "https://github.com/Adrian463588/ParfumCreator"
    );
    await expect(page.locator("article").getByRole("link", { name: /^Release$/i })).toHaveAttribute(
      "href",
      "https://github.com/Adrian463588/ParfumCreator/releases/tag/v1.3.1"
    );
    await expect(page.locator("article").getByRole("link", { name: /Live Demo/i })).toHaveCount(0);
    const parfumImgs = page.locator("article img");
    await expect(parfumImgs).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      const img = parfumImgs.nth(i);
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(async () => img.evaluate((el: HTMLImageElement) => (el.complete ? el.naturalWidth : 0)))
        .toBeGreaterThan(0);
    }
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toHaveText("ParfumCreator");

    await page.goto("/projects/?q=ParfumCreator", { waitUntil: "networkidle" });
    const parfumSearchCard = page.locator("article").filter({ hasText: "ParfumCreator" }).first();
    await expect(parfumSearchCard).toBeVisible();
    await expect(parfumSearchCard.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
      "href",
      "https://github.com/Adrian463588/ParfumCreator"
    );
    await expect
      .poll(async () =>
        parfumSearchCard.locator("img").first().evaluate((el: HTMLImageElement) => (el.complete ? el.naturalWidth : 0))
      )
      .toBeGreaterThan(0);

    for (const check of [
      { slug: "quran-plus", title: "QuranPlus", seo: /QuranPlus — Offline Quran & AI Android App/ },
      { slug: "coffee-creator", title: "Coffee Creator", seo: /Coffee Creator — Coffee Brewing Android App/ },
      { slug: "adzan-plus", title: "AdzanPlus", seo: /AdzanPlus — Prayer Times & Adhan Reminders/ },
    ]) {
      await page.goto(`/projects/${check.slug}/`, { waitUntil: "domcontentloaded" });
      await expect(page).toHaveTitle(check.seo);
      await expect(page.locator("h1")).toHaveText(check.title);
    }

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
    "/projects/android-stress-detection/",
    "/projects/parfum-creator/",
    "/projects/automate-plus/",
    "/projects/heart-rate-monitor/",
    "/resources/",
    "/resources/coffee-brew-ratio-extraction-calculator/",
    "/resources/perfume-concentration-dilution-calculator/",
    "/resources/automate-plus-vs-selenium-ide-katalon/",
  ]) {
    test(`axe-core WCAG 2.2 AA audit passes with zero violations on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });
      await page.addScriptTag({ content: axeSource });
      const results = await page.evaluate(async () => await (window as unknown as { axe: { run: () => Promise<{ violations: Array<{ id: string; impact: string; nodes: Array<{ target: string[] }> }> }> } }).axe.run());
      expect(results.violations).toEqual([]);
    });
  }

  test("V10 Advanced SEO resources hub, approved tools, gated 404 drafts, calculators & bidirectional links work seamlessly", async ({
    page,
    request,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    // 1. Resources hub renders approved guides without drafts
    await page.goto("/resources/", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toHaveText("Engineering Resources.");
    await expect(page.getByText(/Coffee Brew Ratio, Extraction Yield & Recipe Scaler/i)).toBeVisible();
    await expect(page.getByText(/AdzanPlus vs Al-Azan/i)).toHaveCount(0);

    // 2. Sitemap exposes published resources and excludes draft/review slugs
    const sitemapRes = await request.get("/sitemap.xml");
    expect(sitemapRes.status()).toBe(200);
    const sitemapXml = await sitemapRes.text();
    expect(sitemapXml).toContain("/resources/");
    expect(sitemapXml).toContain("/resources/coffee-brew-ratio-extraction-calculator/");
    expect(sitemapXml).not.toContain("adzan-plus-vs-al-azan-offline-prayer");
    expect(sitemapXml).not.toContain("parfum-creator-vs-perfumers-world-comparison");

    // 3. Draft/review routes remain unbuilt (HTTP 404)
    const draftRes = await request.get("/resources/parfum-creator-vs-perfumers-world-comparison/");
    expect(draftRes.status()).toBe(404);

    // 4. Interactive Coffee Calculator computes EY% & scaled pours cleanly
    await page.goto("/resources/coffee-brew-ratio-extraction-calculator/", { waitUntil: "networkidle" });
    await expect(page.getByTestId("coffee-ratio-output")).toHaveText("1:16.67");
    await expect(page.getByTestId("coffee-ey-output")).toHaveText("20.06%");
    await page.getByLabel("Target Water (g)").fill("300");
    await expect(page.locator("table tbody tr").last()).toContainText("300.0 g");

    // 5. Interactive Perfume Calculator analyzes mass & solves target batch
    await page.goto("/resources/perfume-concentration-dilution-calculator/", { waitUntil: "networkidle" });
    await expect(page.getByTestId("perfume-conc-output")).toHaveText("18.00%");
    await page.getByRole("tab", { name: /Solve Target Batch Weight/i }).click();
    await page.getByLabel("Desired Batch Weight (g)").fill("50");
    await page.getByLabel("Target Oil Concentration (%)").fill("22");
    await expect(page.getByTestId("perfume-solved-oil")).toHaveText("11.00 g");

    // 6. Bidirectional linking from Project Case Study -> Resource & responsive 320px/1440px overflow check
    await page.goto("/projects/coffee-creator/", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("link", { name: /Coffee Brew Ratio, Extraction Yield & Recipe Scaler/i })
    ).toBeVisible();

    for (const width of [320, 1024, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      for (const route of ["/resources/", "/resources/automate-plus-vs-selenium-ide-katalon/"]) {
        await page.goto(route, { waitUntil: "networkidle" });
        const hasOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth
        );
        expect(hasOverflow, `Overflow on ${route} at ${width}px`).toBe(false);
      }
    }

    expect(errors).toEqual([]);
  });
});
