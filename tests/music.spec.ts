import { devices, expect, test, type Page } from "@playwright/test";

// The real MP3 is git-ignored until the rights are cleared, so serve one second of
// silence (8-bit WAV) in its place: the tests then run with or without the song.
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

async function open(page: Page, song: "present" | "missing" = "present") {
  await page.route("**/*.mp3", (route) =>
    song === "present"
      ? route.fulfill({ status: 200, contentType: "audio/wav", body: silentWav() })
      : route.fulfill({ status: 404, body: "" }),
  );
  await page.goto("/");
  await page.waitForTimeout(2500); // loader and the autoplay attempt on load
}

const playing = (page: Page) => page.evaluate(() => !document.querySelector("audio")!.paused);
const savedMuted = (page: Page) => page.evaluate(() => localStorage.getItem("ancestros-muted"));

test("blocked on load; a first click on Música plays and is not saved as muted", async ({ page }) => {
  await open(page);
  expect(await playing(page)).toBe(false);
  await page.click("[data-music-toggle]");
  await expect.poll(() => playing(page)).toBe(true);
  expect(await savedMuted(page)).not.toBe("1");
});

test("a first click anywhere else starts the music", async ({ page }) => {
  await open(page);
  await page.mouse.click(600, 400);
  await expect.poll(() => playing(page)).toBe(true);
});

test("without the song file the Música button hides", async ({ page }) => {
  await open(page, "missing");
  await page.mouse.click(600, 400);
  await expect(page.locator("[data-music-toggle]")).toHaveCount(0);
});

test.describe("phone", () => {
  // A device profile minus defaultBrowserType, which can't be set per group.
  const { viewport, userAgent, deviceScaleFactor, isMobile, hasTouch } = devices["Pixel 7"];
  test.use({ viewport, userAgent, deviceScaleFactor, isMobile, hasTouch });

  test("a tap starts the music", async ({ page }) => {
    await open(page);
    await page.tap("h1");
    await expect.poll(() => playing(page)).toBe(true);
  });

  test("scrolling first doesn't stop a later tap from starting it", async ({ page }) => {
    await open(page);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Input.synthesizeScrollGesture", { x: 200, y: 600, yDistance: -300, gestureSourceType: "touch" });
    await page.tap("h1");
    await expect.poll(() => playing(page)).toBe(true);
  });
});
