// CSS url() strings are not rewritten by Next, so prefix the GitHub Pages base path ourselves.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Background layer for a photo, stacked over the gradient that shows while it loads.
export const photoLayer = (photo?: string) =>
  photo ? `url("${basePath}${photo}") center / cover no-repeat, ` : "";
