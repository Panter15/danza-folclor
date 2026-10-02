"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { tours } from "@/content/site";
import { useLanguage } from "./LanguageProvider";

export function Tours() {
  const { lang, t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

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
        <div className="mb-10 flex items-end justify-between gap-4 px-4 md:px-8">
          <h2 className="font-display text-5xl md:text-7xl">{t("toursTitle")}</h2>
          <p className="text-xs uppercase tracking-[0.3em] text-ink/50">{t("toursHint")} →</p>
        </div>

        {/* With reduced motion there is no pinned scroll, so let people swipe the cards sideways instead. */}
        <div className="motion-reduce:overflow-x-auto">
        <div ref={track} className="flex w-max gap-6 px-4 md:gap-10 md:px-8">
          {tours.map((tour, i) => (
            <article key={`${tour.city}-${i}`} className="w-[78vw] shrink-0 sm:w-[50vw] lg:w-[34vw]">
              <div className="relative h-[42svh] overflow-hidden rounded">
                {/* Placeholder "photo": replace with a real image from this tour. */}
                <div
                  className="tour-media absolute -inset-x-[15%] inset-y-0"
                  style={{ background: `linear-gradient(120deg, ${tour.palette[0]}, ${tour.palette[1]})` }}
                  aria-hidden="true"
                />
                <span className="absolute left-4 top-4 font-display text-2xl text-white mix-blend-difference">
                  {tour.year}
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-ink/15 pb-4">
                <h3 className="font-display text-3xl md:text-4xl">{tour.city}</h3>
                <span className="text-xs uppercase tracking-[0.3em] text-ink/60">{tour.country[lang]}</span>
              </div>
              <p className="mt-3 text-sm text-ink/70">{tour.event[lang]}</p>
            </article>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
