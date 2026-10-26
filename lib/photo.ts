// Next does not rewrite asset paths used in CSS url() or new Image(), so prefix the GitHub Pages base path ourselves.
export const withBase = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

// CSS background for a photo, stacked over `under` (e.g. a gradient that shows while
// it loads or when there is no photo). Either part may be missing.
export const photoLayer = (photo?: string, under = "", size: "cover" | "contain" = "cover") =>
  [photo && `url("${withBase(photo)}") center / ${size} no-repeat`, under].filter(Boolean).join(", ");
