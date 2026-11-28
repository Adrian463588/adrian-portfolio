import { devices, expect, test, type Page } from "@playwright/test";

const portrait = (page: Page) => page.getByRole("button", { name: "Interact with Adrian's illustrated avatar" });
const speech = (page: Page) => page.locator("#about").getByRole("status");
const video = "https://youtu.be/dQw4w9WgXcQ";

test.use({ reducedMotion: "reduce" });

test("mouse hover, Enter, and Space advance only intentional activation and open one secure tab", async ({ page, context }) => {
  await context.route(video, (route) => route.fulfill({ contentType: "text/html", body: "<title>Video destination</title>" }));
  await page.goto("/");
  const button = portrait(page);
  await button.hover();
  await expect(speech(page)).toHaveText("Hey, you!");
  await expect(button.locator('img[src$="/winking.webp"]')).toBeVisible();
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(speech(page)).toHaveText("Hi there!");
  await expect(button.locator('img[src$="/greeting.webp"]')).toBeVisible();
  await page.mouse.move(0, 0);
  await button.hover();
  await expect(speech(page)).toHaveText("Hi there!");
  await page.keyboard.press("Space");
  await expect(speech(page)).toHaveText("Nice to meet you!");
  await expect(button.locator('img[src$="/happy.webp"]')).toBeVisible();

  for (const [text, file] of [
    ["Haha, that tickles!", "laughing.webp"],
    ["Wait... again?", "surprised.webp"],
    ["Hey! I'm working!", "confused.webp"],
    ["Stop poking me!", "angry.webp"],
    ["Fine. I have a surprise for you.", "mischievous.webp"],
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
  await expect(speech(page)).toHaveText("You've been Rickrolled!");
  await expect(button.locator('img[src$="/rickroll.webp"]')).toBeVisible();
  await button.click({ clickCount: 3 });
  expect(context.pages()).toHaveLength(2);
  expect(new URL(page.url()).pathname).toBe("/");
});

test("blocked popups keep the eighth-step manual link available", async ({ page, context }) => {
  await page.addInitScript(() => { window.open = () => null; });
  await context.route(video, (route) => route.fulfill({ body: "Video destination" }));
  await page.goto("/");
  const button = portrait(page);
  for (let i = 0; i < 8; i++) await button.click();
  await expect(speech(page)).toHaveText("You've been Rickrolled!");
  const link = page.locator("#about").getByRole("link", { name: "Open video" });
  await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  const [popup] = await Promise.all([context.waitForEvent("page"), link.click()]);
  await expect(popup).toHaveURL(video);
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
  await expect(speech(page)).toHaveText("Nice to meet you!");
  await expect(greeting).toHaveCSS("opacity", "1");
  finishRequest();
  await expect(greeting).toHaveCSS("opacity", "0");
  await expect(button.locator('img[src$="/happy.webp"]')).toHaveCount(0);
  await expect(button.getByAltText("Illustrated portrait of Adrian Syah Abidin.")).toBeVisible();
});

test.describe("short landscape", () => {
  test.use({ viewport: { width: 844, height: 310 }, hasTouch: true, isMobile: true });

  test("pins dialogue above the viewport edge when the lower portrait is below the fold", async ({ page }) => {
    await page.goto("/#about");
    const button = portrait(page);
    await button.evaluate((el) => window.scrollBy({
      top: el.getBoundingClientRect().top - 160,
      behavior: "instant",
    }));
    const rect = (await button.boundingBox())!;
    expect(rect.y + rect.height).toBeGreaterThan(310);
    await page.touchscreen.tap(rect.x + rect.width / 2, rect.y + 35);
    await expect(speech(page)).toHaveText("Hi there!");
    await expect(speech(page)).toBeInViewport({ ratio: 1 });
  });
});

for (const device of ["Pixel 7", "iPhone 13", "iPad (gen 7)"] as const) {
  test.describe(device, () => {
    const { viewport, deviceScaleFactor, isMobile, hasTouch, userAgent } = devices[device];
    test.use({ viewport, deviceScaleFactor, isMobile, hasTouch, userAgent });

    test("single taps work without overflow or layout movement in both orientations", async ({ page }) => {
      await page.addInitScript(() => { window.open = () => null; });
      await page.goto("/#about");
      await page.evaluate(() => document.fonts.ready);
      const button = portrait(page);
      await button.scrollIntoViewIfNeeded();
      const documentBounds = () => button.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return [rect.left + window.scrollX, rect.top + window.scrollY, rect.width, rect.height];
      });
      const initial = await documentBounds();
      await button.tap();
      await expect(speech(page)).toHaveText("Hi there!");
      await expect.poll(async () => Math.max(...(await documentBounds()).map(
        (value, index) => Math.abs(value - initial[index])
      ))).toBeLessThan(1);

      await page.setViewportSize({ width: viewport.height, height: viewport.width });
      for (let i = 0; i < 7; i++) await button.tap();
      await expect(speech(page)).toHaveText("You've been Rickrolled!");
      const fit = await speech(page).evaluate((el) => {
        const bubble = el.parentElement!.getBoundingClientRect();
        const rect = el.closest("figure")!.getBoundingClientRect();
        return bubble.left >= rect.left && bubble.right <= rect.right &&
          bubble.left >= 0 && bubble.right <= window.innerWidth &&
          document.documentElement.scrollWidth === document.documentElement.clientWidth;
      });
      expect(fit).toBe(true);
    });
  });
}
