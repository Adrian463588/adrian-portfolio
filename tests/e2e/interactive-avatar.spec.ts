import { devices, expect, test, type Page } from "@playwright/test";

const portrait = (page: Page) => page.getByRole("button", { name: "Interact with Adrian's illustrated avatar" });
const bubble = (page: Page) => page.getByTestId("avatar-speech-bubble");
const speech = (page: Page) => page.locator("#about").getByRole("status");
const video = "https://youtu.be/dQw4w9WgXcQ";

test.use({ reducedMotion: "reduce" });

test("external bubble clears portrait, adapts across desktop scroll states & click-8 opens secure tab", async ({ page, context }) => {
  await context.route(video, (route) => route.fulfill({ contentType: "text/html", body: "<title>Video destination</title>" }));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const button = portrait(page);
  await button.hover();
  await expect(speech(page)).toHaveText("Hey, you!");
  await expect(button.locator('img[src$="/winking.webp"]')).toBeVisible();
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(speech(page)).toHaveText("Oh, hi there!");
  await expect(button.locator('img[src$="/greeting.webp"]')).toBeVisible();

  await page.mouse.move(0, 0);
  await button.hover();
  await expect(speech(page)).toHaveText("Oh, hi there!");
  await page.keyboard.press("Space");
  await expect(speech(page)).toHaveText("Nice to see you!");
  await expect(button.locator('img[src$="/happy.webp"]')).toBeVisible();

  for (const [text, file] of [
    ["Haha, that tickles!", "laughing.webp"],
    ["Wait... again?", "surprised.webp"],
    ["Don't you have work to do?", "confused.webp"],
    ["Hey! I'm trying to code!", "angry.webp"],
    ["Alright... I've got something for you.", "mischievous.webp"],
  ] as const) {
    await button.click();
    await expect(speech(page)).toHaveText(text);
    const img = button.locator(`img[src$="/${file}"]`);
    await expect(img).toBeVisible();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBe(1000);
  }
  await expect(page.locator("#about").getByRole("link", { name: "Open video" })).toHaveCount(0);

  const [popup] = await Promise.all([context.waitForEvent("page"), button.click()]);
  await expect(popup).toHaveURL(video);
  expect(await popup.evaluate(() => window.opener === null && document.referrer === "")).toBe(true);
  await expect(speech(page)).toHaveText("Gotcha! You've been Rickrolled. 😎");
  await expect(button.locator('img[src$="/rickroll.webp"]')).toBeVisible();

  // Primary 1440px desktop placement sits OUTSIDE figure (top-end) with 0% portrait overlap
  const desktopPlacement = await bubble(page).evaluate((bEl) => {
    const b = bEl.getBoundingClientRect();
    const fig = document.querySelector("#about figure")!.getBoundingClientRect();
    const btn = document.querySelector('#about button[aria-label*="illustrated avatar"]')!.getBoundingClientRect();
    const noPortraitOverlap =
      b.bottom <= btn.top + 1 || b.top >= btn.bottom - 1 || b.right <= btn.left + 1 || b.left >= btn.right - 1;
    return {
      outsideFigure: bEl.closest("figure") === null,
      placement: bEl.getAttribute("data-placement"),
      tailSide: bEl.getAttribute("data-tail-side"),
      aboveCard: b.bottom <= fig.top - 10,
      noPortraitOverlap,
    };
  });
  expect(desktopPlacement).toEqual({
    outsideFigure: true,
    placement: "top-end",
    tailSide: "bottom",
    aboveCard: true,
    noPortraitOverlap: true,
  });

  // Scrolling portrait near top Navbar flips bubble smoothly without clipping or covering portrait
  await button.evaluate((el) => window.scrollBy({
    top: el.getBoundingClientRect().top - 78,
    behavior: "instant",
  }));
  await page.waitForTimeout(80);
  const flipped = await bubble(page).evaluate((bEl) => {
    const b = bEl.getBoundingClientRect();
    const btn = document.querySelector('#about button[aria-label*="illustrated avatar"]')!.getBoundingClientRect();
    const nav = document.querySelector("header")?.getBoundingClientRect();
    const noPortraitOverlap =
      b.bottom <= btn.top + 1 || b.top >= btn.bottom - 1 || b.right <= btn.left + 1 || b.left >= btn.right - 1;
    return {
      placement: bEl.getAttribute("data-placement"),
      clearsNav: nav ? b.top >= nav.bottom - 1 : true,
      noPortraitOverlap,
      inViewport: b.left >= 0 && b.right <= window.innerWidth && b.bottom <= window.innerHeight,
    };
  });
  expect(["bottom-center", "right-start"]).toContain(flipped.placement);
  expect(flipped.clearsNav).toBe(true);
  expect(flipped.noPortraitOverlap).toBe(true);
  expect(flipped.inViewport).toBe(true);

  await button.click({ clickCount: 3 });
  expect(context.pages()).toHaveLength(2);
  expect(new URL(page.url()).pathname).toBe("/");
});

test("blocked popups keep eighth-step Open video link clickable outside portrait bounds", async ({ page, context }) => {
  await page.addInitScript(() => { window.open = () => null; });
  await context.route(video, (route) => route.fulfill({ body: "Video destination" }));
  await page.goto("/");
  const button = portrait(page);
  for (let i = 0; i < 8; i++) await button.click();
  await expect(speech(page)).toHaveText("Gotcha! You've been Rickrolled. 😎");
  const link = page.locator("#about").getByRole("link", { name: "Open video" });
  await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  const [popup] = await Promise.all([context.waitForEvent("page"), link.click()]);
  await expect(popup).toHaveURL(video);
});

test("keeps external zero-occlusion bubble inside viewport across 320, 375, 768, 1024, and 1440 viewports", async ({ page }) => {
  await page.addInitScript(() => { window.open = () => null; });
  await page.goto("/");
  const button = portrait(page);
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await expect(speech(page)).toHaveText("Oh, hi there!");

  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 860 });
    await button.evaluate((el) => {
      const top = el.getBoundingClientRect().top;
      window.scrollBy({ top: top - 190, behavior: "instant" });
    });
    await page.waitForTimeout(80);
    const metrics = await bubble(page).evaluate((bEl) => {
      const b = bEl.getBoundingClientRect();
      const btn = document.querySelector('#about button[aria-label*="illustrated avatar"]')!.getBoundingClientRect();
      const noPortraitOverlap =
        b.bottom <= btn.top + 1 || b.top >= btn.bottom - 1 || b.right <= btn.left + 1 || b.left >= btn.right - 1;
      return {
        noPortraitOverlap,
        withinViewport: b.left >= 0 && b.right <= window.innerWidth && b.width <= 241,
        noHorizontalOverflow: document.documentElement.scrollWidth === document.documentElement.clientWidth,
      };
    });
    expect(metrics, `Viewport ${width}px failed external placement check`).toEqual({
      noPortraitOverlap: true,
      withinViewport: true,
      noHorizontalOverflow: true,
    });
  }
});

test("keeps the previous portrait during decode and falls back on an asset error", async ({ page }) => {
  let finishRequest!: () => void;
  const release = new Promise<void>((resolve) => { finishRequest = resolve; });
  await page.route("**/images/avatar/about/happy.webp", async (route) => {
    await release;
    await route.abort();
  });
  await page.goto("/");
  const button = portrait(page);
  await button.click();
  const greeting = button.locator('img[src$="/greeting.webp"]');
  await expect(greeting).toBeVisible();
  await expect.poll(() => greeting.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBe(1000);
  await button.click();
  await expect(speech(page)).toHaveText("Nice to see you!");
  await expect(greeting).toHaveCSS("opacity", "1");
  finishRequest();
  await expect(greeting).toHaveCSS("opacity", "0");
  await expect(button.locator('img[src$="/happy.webp"]')).toHaveCount(0);
  await expect(button.getByAltText("Illustrated portrait of Adrian Syah Abidin.")).toBeVisible();
});

test.describe("short landscape", () => {
  test.use({ viewport: { width: 844, height: 310 }, hasTouch: true, isMobile: true });

  test("places external bubble above portrait within short viewport bounds", async ({ page }) => {
    await page.goto("/#about");
    const button = portrait(page);
    await button.evaluate((el) => window.scrollBy({
      top: el.getBoundingClientRect().top - 160,
      behavior: "instant",
    }));
    const rect = (await button.boundingBox())!;
    expect(rect.y + rect.height).toBeGreaterThan(310);
    await page.touchscreen.tap(rect.x + rect.width / 2, rect.y + 35);
    await expect(speech(page)).toHaveText("Oh, hi there!");
    await expect(bubble(page)).toBeInViewport({ ratio: 1 });
  });
});

for (const device of ["Pixel 7", "iPhone 13", "iPad (gen 7)"] as const) {
  test.describe(device, () => {
    const { viewport, deviceScaleFactor, isMobile, hasTouch, userAgent } = devices[device];
    test.use({ viewport, deviceScaleFactor, isMobile, hasTouch, userAgent });

    test("single taps render external bubble cleanly without overflow or layout movement in both orientations", async ({ page }) => {
      await page.addInitScript(() => { window.open = () => null; });
      await page.goto("/#about");
      await page.evaluate(() => document.fonts.ready);
      const button = portrait(page);
      await button.evaluate((el) => {
        window.scrollBy({ top: el.getBoundingClientRect().top - 160, behavior: "instant" });
      });
      const documentBounds = () => button.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return [rect.left + window.scrollX, rect.top + window.scrollY, rect.width, rect.height];
      });
      const initial = await documentBounds();
      await button.tap();
      await expect(speech(page)).toHaveText("Oh, hi there!");
      await expect.poll(async () => Math.max(...(await documentBounds()).map(
        (value, index) => Math.abs(value - initial[index])
      ))).toBeLessThan(1);

      await page.setViewportSize({ width: viewport.height, height: viewport.width });
      for (let i = 0; i < 7; i++) await button.tap();
      await expect(speech(page)).toHaveText("Gotcha! You've been Rickrolled. 😎");
      const fit = await bubble(page).evaluate((bEl) => {
        const b = bEl.getBoundingClientRect();
        const btn = document.querySelector('#about button[aria-label*="illustrated avatar"]')!.getBoundingClientRect();
        const noPortraitOverlap =
          b.bottom <= btn.top + 1 || b.top >= btn.bottom - 1 || b.right <= btn.left + 1 || b.left >= btn.right - 1;
        return b.left >= 0 && b.right <= window.innerWidth &&
          noPortraitOverlap &&
          document.documentElement.scrollWidth === document.documentElement.clientWidth;
      });
      expect(fit).toBe(true);
    });
  });
}
