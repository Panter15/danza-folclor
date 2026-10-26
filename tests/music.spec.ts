import { devices, expect, test, type Page } from "@playwright/test";

// Serve one second of silence (8-bit WAV) instead of the real 6 MB song: faster,
// and the tests don't depend on which recording the site uses.
function silentWav(seconds = 1, rate = 8000) {
  const size = rate * seconds;
  const b = Buffer.alloc(44 + size, 128); // 128 = silence in 8-bit PCM
  b.write("RIFF", 0);
  b.writeUInt32LE(36 + size, 4);
  b.write("WAVEfmt ", 8);
  b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20); // PCM
  b.writeUInt16LE(1, 22); // mono
  b.writeUInt32LE(rate, 24);
  b.writeUInt32LE(rate, 28);
  b.writeUInt16LE(1, 32);
  b.writeUInt16LE(8, 34);
  b.write("data", 36);
  b.writeUInt32LE(size, 40);
  return b;
}

async function open(page: Page, { song = "present", muted = false } = {}) {
  await page.route("**/*.mp3", (route) =>
    song === "present"
      ? route.fulfill({ status: 200, contentType: "audio/wav", body: silentWav() })
      : route.fulfill({ status: 404, body: "" }),
  );
  if (muted) await page.addInitScript(() => localStorage.setItem("ancestros-muted", "1"));
  await page.goto("/");
  await expect(enterButton(page)).toBeVisible({ timeout: 15_000 }); // loading screen done
}

const enterButton = (page: Page) => page.getByRole("button", { name: "Entrar" });
const playing = (page: Page) => page.evaluate(() => !document.querySelector("audio")!.paused);
const savedMuted = (page: Page) => page.evaluate(() => localStorage.getItem("ancestros-muted"));

// Whether sound is blocked before Entrar is up to the browser (the test browser
// sometimes allows it), so that isn't asserted; what Entrar does is.
test("Entrar opens the site and starts the music", async ({ page }) => {
  await open(page);
  await enterButton(page).click();
  await expect.poll(() => playing(page)).toBe(true);
  await expect(page.getByRole("status")).toBeHidden();
});

test("the loading screen keeps the page from scrolling behind it", async ({ page }) => {
  await open(page);
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test("Música turns it off and that is remembered", async ({ page }) => {
  await open(page);
  await enterButton(page).click();
  await expect.poll(() => playing(page)).toBe(true);
  await page.click("[data-music-toggle]");
  await expect.poll(() => playing(page)).toBe(false);
  expect(await savedMuted(page)).toBe("1");
});

test("a visitor who muted it enters in silence, and Música still turns it on", async ({ page }) => {
  await open(page, { muted: true });
  await enterButton(page).click();
  await page.waitForTimeout(1000);
  expect(await playing(page)).toBe(false);
  await page.click("[data-music-toggle]");
  await expect.poll(() => playing(page)).toBe(true);
});

test("without the song file the Música button hides", async ({ page }) => {
  await open(page, { song: "missing" });
  await enterButton(page).click();
  await expect(page.locator("[data-music-toggle]")).toHaveCount(0);
});

test.describe("phone", () => {
  // A device profile minus defaultBrowserType, which can't be set per group.
  const { viewport, userAgent, deviceScaleFactor, isMobile, hasTouch } = devices["Pixel 7"];
  test.use({ viewport, userAgent, deviceScaleFactor, isMobile, hasTouch });

  test("tapping Entrar starts the music", async ({ page }) => {
    await open(page);
    await enterButton(page).tap();
    await expect.poll(() => playing(page)).toBe(true);
  });

  test("a swipe on the loading screen first doesn't stop Entrar from starting it", async ({ page }) => {
    await open(page);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Input.synthesizeScrollGesture", { x: 200, y: 600, yDistance: -300, gestureSourceType: "touch" });
    await enterButton(page).tap();
    await expect.poll(() => playing(page)).toBe(true);
  });
});
