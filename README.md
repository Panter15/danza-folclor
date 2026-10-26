# Fundación Ancestros — website

One-page site for Fundación Cultural y Social Ancestros, a folk-dance group from Ciénaga, Magdalena (Colombia).
Next.js (static export) + Tailwind + GSAP/ScrollTrigger + Lenis.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm test        # browser tests for the music button (uses your installed Chrome)
```

## Where things live

- **All text, events and photo paths:** `content/site.ts` (Spanish and English). Facts come from the group's CV — never invent places or dates.
- **Photos:** `public/photos/`, hero clip: `public/hero/`, logo: `public/logo.webp`.
- **Sections:** `components/` (one file per section).

## Deploy

Every push to `main` builds and publishes to GitHub Pages (`.github/workflows/deploy.yml`), under `/danza-folclor`.
Work on a new branch and open a PR.

## Music

The "Música" button plays `public/music/caiman-cienaguero.mp3`. That file is **git-ignored on purpose**: the group
does not yet have permission to publish the recording. Without it the button hides itself. Only remove the line from
`.gitignore` once permission exists (or the file is the group's own recording) — git history keeps a file forever.
