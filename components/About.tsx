"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { flyingImages, values } from "@/content/site";
import { photoLayer, withBase } from "@/lib/photo";
import { useLanguage } from "./LanguageProvider";

/**
 * Random photo layout that still covers the whole width and never stacks one
 * photo on another: the screen is split into lanes, every row of `lanes` photos
 * uses each lane once in a new random order, and each photo starts a random gap
 * below the previous one in its lane. Widths are random within a range.
 * Returns left/width in % of the stage and top in vw (photos are 3:4, so a
 * photo's height is width × 4/3 in the same unit). `height` is the tallest lane.
 */
export function layoutPhotos(count: number, lanes: number, minW: number, maxW: number, rand = Math.random) {
  const laneW = 100 / lanes;
  const bottoms = new Array<number>(lanes).fill(0);
  const spots: { left: number; width: number; top: number }[] = [];
  for (let row = 0; row * lanes < count; row++) {
    const order = Array.from({ length: lanes }, (_, i) => i).sort(() => rand() - 0.5);
    for (const lane of order) {
      if (spots.length === count) break;
      const width = Math.min(laneW, minW + rand() * (maxW - minW));
      const top = bottoms[lane] + (row === 0 ? rand() * 30 : 4 + rand() * 12);
      spots.push({ left: lane * laneW + rand() * (laneW - width), width, top });
      bottoms[lane] = top + (width * 4) / 3;
    }
  }
  return { spots, height: Math.max(...bottoms) };
}

// Self-check: photos sharing a lane never overlap vertically.
if (process.env.NODE_ENV !== "production") {
  const { spots } = layoutPhotos(12, 4, 16, 24);
  spots.forEach((a, i) =>
    spots.slice(i + 1).forEach((b) => {
      const sameLane = a.left < b.left + b.width && b.left < a.left + a.width;
      const apart = a.top + (a.width * 4) / 3 <= b.top || b.top + (b.width * 4) / 3 <= a.top;
      console.assert(!sameLane || apart, "layoutPhotos: overlapping photos", a, b);
    }),
  );
}

// Photos the lightbox can browse, in page order.
const gallery = flyingImages.flatMap((img) => (img.photo ? [img.photo] : []));
const roundButton =
  "fixed grid h-12 w-12 place-items-center rounded-full border border-white/30 text-lg text-white transition-colors hover:bg-white hover:text-ink";

export function About() {
  const { lang, t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  // Index into gallery of the photo open in the lightbox, or null.
  const [viewing, setViewing] = useState<number | null>(null);
  const step = (dir: number) =>
    setViewing((v) => (v === null ? v : (v + dir + gallery.length) % gallery.length));

  // Native modal: Esc, focus trapping and the backdrop come from the browser.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (viewing !== null && !d.open) d.showModal();
    if (viewing === null && d.open) d.close();
    // Stop the page scrolling underneath while a photo is open.
    document.documentElement.style.overflow = viewing !== null ? "hidden" : "";
  }, [viewing]);

  // Flying photos: built once (they don't depend on the text).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ phone: "(max-width: 767px)", motion: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        const photos = gsap.utils.shuffle(gsap.utils.toArray<HTMLElement>(".fly-photo"));
        // Phones: one lane of big photos. Desktop: four lanes across the whole width.
        const { spots, height } = ctx.conditions.phone
          ? layoutPhotos(photos.length, 1, 58, 80)
          : layoutPhotos(photos.length, 4, 16, 24);
        photos.forEach((photo, i) =>
          gsap.set(photo, { left: `${spots[i].left}%`, width: `${spots[i].width}%`, top: `${spots[i].top}vw` }),
        );

        // All photos ride one track that rises from below the screen to above it
        // while the headline stays pinned. Same speed for all, so none catches up
        // with and covers another.
        gsap.fromTo(
          ".fly-track",
          { y: () => window.innerHeight },
          {
            y: () => -(height * window.innerWidth) / 100,
            ease: "none",
            scrollTrigger: {
              trigger: ".fly-stage",
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              // Recalculate the window-size-based distances on resize / rotation.
              invalidateOnRefresh: true,
            },
          },
        );

        gsap.from(".fly-headline-inner", {
          yPercent: 110,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".fly-stage", start: "top 60%" },
        });
      });
    },
    { scope: root },
  );

  // The word reveal is rebuilt on language change because the word spans change.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".about-word",
          { opacity: 0.2 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: { trigger: ".about-body", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
      });
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  const headline = [t("aboutHeadline1"), t("aboutHeadline2"), t("aboutHeadline3")];

  return (
    <section ref={root} id="historia" className="bg-paper text-ink">
      {/* Part 1: photos fly past a pinned headline (Art of Documentary). */}
      <div className="fly-stage relative h-[350svh] motion-reduce:h-auto">
        {/* bg-paper matters: the headline blends (difference) against this layer's own background. */}
        <div className="sticky top-0 h-svh overflow-hidden bg-paper motion-reduce:static motion-reduce:h-auto motion-reduce:py-28">
          <div className="fly-track absolute inset-x-0 top-0 motion-reduce:hidden" style={{ transform: "translateY(110vh)" }}>
            {flyingImages.map((img, i) => (
              // left/width/top are set by the random layout above.
              <button
                key={i}
                type="button"
                onClick={() => img.photo && setViewing(gallery.indexOf(img.photo))}
                aria-label={`${t("viewPhoto")} ${i + 1}`}
                className="fly-photo absolute top-0 aspect-[3/4] w-1/4 cursor-zoom-in overflow-hidden"
              >
                {/* Inner layer zooms on hover, clipped by the button so it never spills onto a neighbour. */}
                <span
                  className="block h-full w-full transition-transform duration-700 ease-out hover:scale-110"
                  style={{ background: photoLayer(img.photo, `linear-gradient(150deg, ${img.palette[0]}, ${img.palette[1]})`) }}
                />
              </button>
            ))}
          </div>

          <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white mix-blend-difference motion-reduce:text-ink motion-reduce:mix-blend-normal">
            <p className="label mb-6">{t("aboutTitle")}</p>
            <h2 className="display text-[12vw] md:text-[7vw]">
              {headline.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.08em]">
                  <span className="fly-headline-inner block">
                    {line}
                  </span>
                </span>
              ))}
            </h2>
          </div>
        </div>
      </div>

      {/* Part 2: label on the left, story lights up word by word on the right. */}
      <div className="grid gap-10 px-4 py-28 md:grid-cols-[1fr_3fr] md:px-8 md:py-40 lg:pl-48">
        <p className="label text-accent md:sticky md:top-28 md:self-start">{t("aboutTitle")}</p>
        <div>
          <p className="about-body display text-3xl md:text-5xl" style={{ lineHeight: 1.08 }}>
            {t("aboutBody")
              .split(" ")
              .map((word, i) => (
                <span key={`${word}-${i}`} className="about-word">
                  {word}{" "}
                </span>
              ))}
          </p>

          {/* Mission, vision, objective and values, as in the group's CV. */}
          <div className="mt-20 grid gap-12 border-t border-line pt-10 md:grid-cols-2">
            {(["mission", "vision", "objective"] as const).map((key) => (
              <div key={key}>
                <h3 className="label text-accent">{t(`${key}Title`)}</h3>
                <p className="mt-4 text-lg leading-relaxed text-ink/80">{t(`${key}Body`)}</p>
              </div>
            ))}
            <div>
              <h3 className="label text-accent">{t("valuesTitle")}</h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-lg text-ink/80">
                {values.map((v) => (
                  <li key={v.es}>{v[lang]}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox: Esc, a click on the backdrop or the close button closes it;
          arrows (buttons or keyboard) browse all the photos. */}
      <dialog
        ref={dialog}
        onClose={() => setViewing(null)}
        onClick={(e) => e.target === e.currentTarget && setViewing(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="h-svh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/95 backdrop:backdrop-blur-md"
        data-lenis-prevent
      >
        {/* Same fill as Nuestro folclor: a blurred, darkened copy of the open photo. */}
        {viewing !== null && (
          <div key={viewing} className="pointer-events-none fixed inset-0 overflow-hidden motion-safe:animate-[fade-in_300ms_ease-out]" aria-hidden="true">
            <div className="absolute inset-0 scale-110 blur-2xl" style={{ background: photoLayer(gallery[viewing]) }} />
            <div className="absolute inset-0 bg-black/45" />
          </div>
        )}
        <div
          className="relative flex h-full w-full items-center justify-center p-4 md:p-16"
          onClick={(e) => e.target === e.currentTarget && setViewing(null)}
        >
          {viewing !== null && (
            // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized anyway
            <img
              key={viewing}
              src={withBase(gallery[viewing])}
              alt={t("photoAlt")}
              className="max-h-full max-w-full object-contain shadow-2xl motion-safe:animate-[fade-in_300ms_ease-out]"
            />
          )}
        </div>
        <p className="label fixed bottom-6 left-1/2 -translate-x-1/2 text-white/70">
          {viewing !== null && `${String(viewing + 1).padStart(2, "0")} / ${String(gallery.length).padStart(2, "0")}`}
        </p>
        <button type="button" onClick={() => setViewing(null)} aria-label={t("close")} className={`${roundButton} right-4 top-4`}>
          ✕
        </button>
        <button type="button" onClick={() => step(-1)} aria-label={t("prevPhoto")} className={`${roundButton} bottom-4 left-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2`}>
          ←
        </button>
        <button type="button" onClick={() => step(1)} aria-label={t("nextPhoto")} className={`${roundButton} bottom-4 right-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2`}>
          →
        </button>
      </dialog>
    </section>
  );
}
