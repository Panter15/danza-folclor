import { defineConfig } from "@playwright/test";

// Browser tests against the dev server, in the installed Chrome, with autoplay
// blocked until a gesture, like a visitor's first visit. Run: npm test
// (reuses a running `npm run dev`; set PORT if it isn't on 3000).
const url = `http://localhost:${process.env.PORT ?? 3000}`;

export default defineConfig({
  testDir: "tests",
  use: {
    baseURL: url,
    channel: "chrome",
    launchOptions: { args: ["--autoplay-policy=user-gesture-required"] },
  },
  webServer: {
    command: "npm run dev",
    url,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
