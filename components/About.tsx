"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { flyingImages, stats } from "@/content/site";
import { useLanguage } from "./LanguageProvider";

// Where each flying photo sits horizontally, how big it is, and how fast it
// travels (depth). Faster = feels closer to the camera.
const FLIGHT = [
  { left: "6%", width: "22vw", speed: 1.3 },
  { left: "68%", width: "26vw", speed: 0.9 },
  { left: "38%", width: "16vw", speed: 1.6 },
  { left: "80%", width: "14vw", speed: 1.2 },
  { left: "14%", width: "18vw", speed: 0.8 },
  { left: "56%", width: "20vw", speed: 1.4 },
];

export function About() {
  const { lang, t } = useLanguage();
  const root = useRef<HTMLElement>(null);

  // Flying photos + counters: built once (they don't depend on the text).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
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
        gsap.utils.toArray<HTMLElement>(".fly-photo").forEach((photo, i) => {
          const { speed } = FLIGHT[i % FLIGHT.length];
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

        // Numbers count up when the stats row enters the screen.
        gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
          const counter = { value: 0 };
          gsap.to(counter, {
            value: Number(el.dataset.value),
            duration: 2,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onUpdate: () => {
              el.textContent = Math.round(counter.value).toString();
            },
          });
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
  const items = [
    { value: stats.years, label: t("statYears"), suffix: "+" },
    { value: stats.countries, label: t("statCountries"), suffix: "" },
    { value: stats.shows, label: t("statShows"), suffix: "+" },
  ];

  return (
    <section ref={root} id="historia" className="bg-paper text-ink">
      {/* Part 1: photos fly past a pinned headline (Art of Documentary). */}
      <div className="fly-stage relative h-[250svh] motion-reduce:h-auto">
        {/* bg-paper matters: the headline blends (difference) against this layer's own background. */}
        <div className="sticky top-0 h-svh overflow-hidden bg-paper motion-reduce:static motion-reduce:h-auto motion-reduce:py-28">
          {flyingImages.map((img, i) => {
            const spot = FLIGHT[i % FLIGHT.length];
            return (
              <div
                key={i}
                className="fly-photo absolute top-0 aspect-[3/4] motion-reduce:hidden"
                style={{
                  left: spot.left,
                  width: spot.width,
                  background: `linear-gradient(150deg, ${img.palette[0]}, ${img.palette[1]})`,
                  transform: "translateY(110vh)",
                }}
                aria-hidden="true"
              />
            );
          })}

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white mix-blend-difference motion-reduce:text-ink motion-reduce:mix-blend-normal">
            <p className="label mb-6">{t("aboutTitle")}</p>
            <h2 className="display text-[12vw] md:text-[7vw]">
              {headline.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.08em]">
                  <span className={`fly-headline-inner block ${i === 1 ? "font-serif font-normal tracking-normal" : ""}`}>
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

          <dl className="mt-20 grid gap-10 border-t border-line pt-10 sm:grid-cols-3">
            {items.map((item) => (
              <div key={item.label}>
                <dd className="display text-6xl md:text-7xl">
                  <span className="stat-number" data-value={item.value}>
                    {item.value}
                  </span>
                  {item.suffix}
                </dd>
                <dt className="label mt-3 text-mute">{item.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
