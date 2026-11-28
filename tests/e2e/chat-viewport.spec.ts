import { devices, expect, test, type Page } from "@playwright/test";

const launcher = (page: Page) => page.getByRole("button", { name: "Open Ask Adrian AI assistant" });
const panel = (page: Page) => page.getByRole("dialog", { name: "Ask Adrian" });

test.use({ reducedMotion: "reduce", locale: "en-US" });

for (const device of ["Pixel 7", "iPhone 13", "iPad (gen 7)"] as const) {
  test.describe(device, () => {
    const { viewport, deviceScaleFactor, isMobile, hasTouch, userAgent } = devices[device];
    test.use({ viewport, deviceScaleFactor, isMobile, hasTouch, userAgent });

    test("opens and reopens without focusing the composer", async ({ page }) => {
      await page.goto("/");
      await launcher(page).tap();
      const chat = panel(page);
      const close = chat.getByRole("button", { name: "Close chat" });
      const composer = chat.getByRole("textbox");
      await expect(close).toBeFocused();
      await expect(chat.getByText(/Want to know more about Adrian|Mau tahu lebih banyak/)).toBeInViewport();
      for (const question of ["Work experience", "Featured projects", "Technical skills"]) {
        await expect(chat.getByRole("button", { name: question })).toBeInViewport({ ratio: 1 });
      }
      await composer.tap();
      await expect(composer).toBeFocused();
      await close.tap();
      await expect(chat).toHaveCount(0);
      await expect(launcher(page)).toBeFocused();
      await launcher(page).tap();
      await expect(close).toBeFocused();
    });

    test("fits a panned visual viewport and restores the panel on keyboard dismissal", async ({ page }) => {
      await page.goto("/");
      await launcher(page).tap();
      const chat = panel(page);
      const composer = chat.getByRole("textbox");
      await composer.tap();
      await composer.fill("Work experience");
      const original = (await chat.boundingBox())!;

      for (const size of [
        { width: viewport.width, height: viewport.height, visibleHeight: 300, offsetTop: 42 },
        {
          width: viewport.height, height: viewport.width,
          visibleHeight: device === "iPad (gen 7)" ? 175 : 110, offsetTop: 24,
        },
      ]) {
        await page.setViewportSize({ width: size.width, height: size.height });
        // Playwright device profiles don't include an operating-system keyboard.
        await page.evaluate(({ visibleHeight, offsetTop }) => {
          const visible = window.visualViewport!;
          Object.defineProperties(visible, {
            height: { configurable: true, value: visibleHeight },
            offsetTop: { configurable: true, value: offsetTop },
          });
          visible.dispatchEvent(new Event("resize"));
          visible.dispatchEvent(new Event("scroll"));
        }, size);
        await expect.poll(() => chat.evaluate((dialog) => {
          const visible = window.visualViewport!;
          const { top, bottom, left, right } = dialog.getBoundingClientRect();
          const controls = dialog.querySelectorAll("header, header button, form textarea, form button");
          return top >= visible.offsetTop && bottom <= visible.offsetTop + visible.height &&
            left >= 0 && right <= visible.width + 1 &&
            [...controls].every((control) => {
              const bounds = control.getBoundingClientRect();
              return bounds.top >= top && bounds.bottom <= bottom;
            }) && document.documentElement.scrollWidth === document.documentElement.clientWidth;
        })).toBe(true);
        await expect(chat.getByRole("button", { name: "Send message" })).toBeEnabled();
        await expect.poll(() => chat.locator('[aria-live="polite"]').evaluate(
          (thread) => thread.clientHeight > 0 && thread.scrollHeight > thread.clientHeight
        )).toBe(true);
      }

      await page.setViewportSize(viewport);
      await page.evaluate(() => {
        const visible = window.visualViewport!;
        Reflect.deleteProperty(visible, "height");
        Reflect.deleteProperty(visible, "offsetTop");
        visible.dispatchEvent(new Event("resize"));
      });
      await expect.poll(() => chat.boundingBox()).toEqual(original);
      await expect(composer).toHaveValue("Work experience");
    });
  });
}

test.describe("phone safe areas", () => {
  test.use({ isMobile: true, hasTouch: true, viewport: { width: 393, height: 500 } });

  test("keeps chat controls inside nonzero safe-area insets", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Safe-area emulation uses the Chromium DevTools protocol");
    await page.goto("/");
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setSafeAreaInsetsOverride", {
      insets: { top: 52, left: 28, right: 32, bottom: 34 },
    });
    await launcher(page).tap();
    const chat = panel(page);
    await expect.poll(() => chat.evaluate((dialog) => {
      const { top, left, right, bottom } = dialog.getBoundingClientRect();
      return [left, document.documentElement.clientWidth - right,
        top, document.documentElement.clientHeight - bottom];
    })).toEqual([28, 32, 52, 34]);
  });

  test("preserves page scroll when opening, scrolling and closing the sheet", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 320));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(320);
    await launcher(page).tap();

    const chat = panel(page);
    await chat.getByRole("heading").hover();
    await page.mouse.wheel(0, 500);
    await chat.getByRole("button", { name: "Close chat" }).tap();
    await expect(launcher(page)).toBeFocused();
    expect(await page.evaluate(() => window.scrollY)).toBe(320);
  });
});

test.describe("touchscreen with a hardware keyboard", () => {
  test.use({ hasTouch: true, viewport: { width: 1024, height: 768 } });

  test("keyboard activation focuses Close and allows deliberate Tab navigation to the composer", async ({ page }) => {
    await page.goto("/");
    await launcher(page).focus();
    await page.keyboard.press("Enter");
    const chat = panel(page);
    await expect(chat.getByRole("button", { name: "Close chat" })).toBeFocused();
    await expect(chat.getByRole("textbox")).not.toBeFocused();
    for (let i = 0; i < 5; i++) {
      if (await chat.getByRole("textbox").evaluate((el) => el === document.activeElement)) break;
      await page.keyboard.press("Tab");
    }
    await expect(chat.getByRole("textbox")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(launcher(page)).toBeFocused();
  });
});

test("non-touch desktop opens ready to type", async ({ page }) => {
  await page.goto("/");
  await launcher(page).click();
  await expect(panel(page).getByRole("textbox")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(launcher(page)).toBeFocused();
});
