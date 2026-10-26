"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { tours } from "@/content/site";
import { photoLayer } from "@/lib/photo";
import { useLanguage } from "./LanguageProvider";

// Latest year a tour mentions: "2023 – 2024, 2026" → 2026.
const latestYear = (year: string) => Math.max(...(year.match(/\d{4}/g) ?? ["0"]).map(Number));

// Only tours with a real photo are shown (the others stay in site.ts and appear once a
// photo is added), newest first. Same year keeps the order in site.ts.
const shown = tours.filter((tour) => tour.photo).sort((a, b) => latestYear(b.year) - latestYear(a.year));

// Self-check: ranges and lists resolve to their last year.
if (process.env.NODE_ENV !== "production") {
  console.assert(latestYear("2023 – 2024, 2026") === 2026 && latestYear("2015 – 2024") === 2024, "latestYear");
}

export function Tours() {
  const { lang, t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Horizontal scroll: pin the section and slide the track sideways while the user scrolls down.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const distance = () => (track.current?.scrollWidth ?? 0) - window.innerWidth;

        const slide = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Follow the cards' own (smoothed) progress, not the raw scroll, so the bar
        // and the cards finish together. Attached after creation because GSAP runs
        // onUpdate once while the tween is being built, before `slide` exists.
        slide.eventCallback("onUpdate", () => gsap.set(bar.current, { scaleX: slide.progress() }));

        // Each card's "photo" drifts slightly as it crosses the screen (parallax inside the card).
        gsap.utils.toArray<HTMLElement>(".tour-media").forEach((media) => {
          gsap.fromTo(
            media,
            { xPercent: -10 },
            {
              xPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: media.parentElement,
                containerAnimation: slide,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="giras" className="relative overflow-hidden bg-paper text-ink">
      <div className="flex h-svh flex-col justify-center">
        <div className="mb-10 flex items-end justify-between gap-4 px-4 md:px-8 lg:pl-48">
          <h2 className="display text-[12vw] md:text-[6vw]">
            {t("toursTitle")}{" "}
            <span className="text-[0.45em] font-normal tracking-normal text-mute">{t("toursSubtitle")}</span>
          </h2>
        </div>

        {/* With reduced motion there is no pinned scroll, so let people swipe the cards sideways instead. */}
        <div className="motion-reduce:overflow-x-auto">
          <div ref={track} className="flex w-max gap-4 px-4 md:gap-6 md:px-8 lg:pl-48">
            {shown.map((tour, i) => (
              <article key={i} className="w-[78vw] shrink-0 sm:w-[46vw] lg:w-[30vw]">
                <div className="relative h-[44svh] overflow-hidden">
                  <div
                    className="tour-media absolute -inset-x-[15%] inset-y-0"
                    style={{ background: `${photoLayer(tour.photo)}linear-gradient(120deg, ${tour.palette[0]}, ${tour.palette[1]})` }}
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  {tour.city ? (
                    <h3 className="display text-3xl md:text-4xl">{tour.city}</h3>
                  ) : (
                    <h3 className="display text-xl md:text-2xl">{tour.event[lang]}</h3>
                  )}
                  <span className="label shrink-0 text-mute">{tour.year}</span>
                </div>
                {tour.city && (
                  <p className="label mt-3 text-mute">
                    {tour.country?.[lang]} — {tour.event[lang]}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Natural mapping: a horizontal bar that fills left → right as the cards
            slide, so the sideways movement explains itself. Hidden with reduced
            motion, where the row is swiped instead. */}
        <div className="mx-4 mt-10 h-px bg-line md:mx-8 lg:ml-48 motion-reduce:hidden" aria-hidden="true">
          <div ref={bar} className="h-full origin-left bg-ink" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
