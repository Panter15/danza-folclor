// Next does not rewrite asset paths used in CSS url() or new Image(), so prefix the GitHub Pages base path ourselves.
export const withBase = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

// Background layer for a photo, stacked over the gradient that shows while it loads.
export const photoLayer = (photo?: string, size: "cover" | "contain" = "cover") =>
  photo ? `url("${withBase(photo)}") center / ${size} no-repeat, ` : "";
