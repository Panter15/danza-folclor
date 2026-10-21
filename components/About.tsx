"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { flyingImages, values } from "@/content/site";
import { photoLayer, withBase } from "@/lib/photo";
import { useLanguage } from "./LanguageProvider";

/**
 * Random photo layout that still covers the whole width: the screen is split
 * into lanes, and every row of `lanes` photos uses each lane once, in a new
 * random order. Widths and speeds are random within a range.
 * Returns left/width in % of the stage, speed as a multiplier (faster = closer).
 */
export function layoutPhotos(count: number, lanes: number, minW: number, maxW: number, rand = Math.random) {
  const laneW = 100 / lanes;
  const spots: { left: number; width: number; speed: number }[] = [];
  for (let row = 0; row * lanes < count; row++) {
    const order = Array.from({ length: lanes }, (_, i) => i).sort(() => rand() - 0.5);
    for (const lane of order) {
      if (spots.length === count) break;
      const width = Math.min(laneW, minW + rand() * (maxW - minW));
      spots.push({ left: lane * laneW + rand() * (laneW - width), width, speed: 0.8 + rand() * 0.9 });
    }
  }
  return spots;
}

export function About() {
  const { lang, t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [viewing, setViewing] = useState<string | null>(null);

  // Native modal: Esc, focus trapping and the backdrop come from the browser.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (viewing && !d.open) d.showModal();
    if (!viewing && d.open) d.close();
    // Stop the page scrolling underneath while a photo is open.
    document.documentElement.style.overflow = viewing ? "hidden" : "";
  }, [viewing]);

  // Flying photos: built once (they don't depend on the text).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ phone: "(max-width: 767px)", motion: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        const photos = gsap.utils.shuffle(gsap.utils.toArray<HTMLElement>(".fly-photo"));
        // Phones: one lane of big photos. Desktop: four lanes across the whole width.
        const spots = ctx.conditions.phone
          ? layoutPhotos(photos.length, 1, 58, 80)
          : layoutPhotos(photos.length, 4, 16, 24);
        photos.forEach((photo, i) => gsap.set(photo, { left: `${spots[i].left}%`, width: `${spots[i].width}%` }));

        // Each photo rises from below the screen to above it while the headline
        // stays pinned. Different speeds and start offsets give depth.
        const flight = gsap.timeline({
          scrollTrigger: {
            trigger: ".fly-stage",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            // Recalculate the window-height-based distances on resize / rotation.
            invalidateOnRefresh: true,
          },
        });
        photos.forEach((photo, i) => {
          const { speed } = spots[i];
          flight.fromTo(
            photo,
            { yPercent: 0, y: () => window.innerHeight * 1.1, scale: 0.85 },
            { y: () => -window.innerHeight * 1.2 * speed, scale: 1.05, ease: "none", duration: 1 },
            i * 0.12,
          );
        });

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
          {flyingImages.map((img, i) => (
            // left/width are set by the random layout above.
            <button
              key={i}
              type="button"
              onClick={() => img.photo && setViewing(img.photo)}
              aria-label={`${t("viewPhoto")} ${i + 1}`}
              className="fly-photo absolute top-0 aspect-[3/4] w-1/4 cursor-zoom-in overflow-hidden motion-reduce:hidden"
              style={{ transform: "translateY(110vh)" }}
            >
              {/* Inner layer zooms on hover; the outer one is moved by GSAP. */}
              <span
                className="block h-full w-full transition-transform duration-700 ease-out hover:scale-110"
                style={{ background: `${photoLayer(img.photo)}linear-gradient(150deg, ${img.palette[0]}, ${img.palette[1]})` }}
              />
            </button>
          ))}

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

      {/* Lightbox: click outside the photo or press Esc to close. */}
      <dialog
        ref={dialog}
        onClose={() => setViewing(null)}
        onClick={(e) => e.target === e.currentTarget && setViewing(null)}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/90"
        data-lenis-prevent
      >
        {viewing && (
          // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized anyway
          <img src={withBase(viewing)} alt={t("photoAlt")} className="max-h-[90svh] max-w-[92vw] object-contain" />
        )}
        <button
          type="button"
          onClick={() => setViewing(null)}
          className="label fixed right-4 top-4 bg-paper px-3 py-2 text-ink"
        >
          {t("close")} ✕
        </button>
      </dialog>
    </section>
  );
}
