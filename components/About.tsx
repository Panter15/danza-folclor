"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { flyingImages, values } from "@/content/site";
import { photoLayer } from "@/lib/photo";
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
  { left: "28%", width: "15vw", speed: 1.1 },
  { left: "74%", width: "19vw", speed: 1.5 },
  { left: "2%", width: "16vw", speed: 1.0 },
  { left: "46%", width: "22vw", speed: 0.85 },
  { left: "86%", width: "12vw", speed: 1.7 },
  { left: "20%", width: "24vw", speed: 1.25 },
];

export function About() {
  const { lang, t } = useLanguage();
  const root = useRef<HTMLElement>(null);

  // Flying photos: built once (they don't depend on the text).
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
          {flyingImages.map((img, i) => {
            const spot = FLIGHT[i % FLIGHT.length];
            return (
              <div
                key={i}
                className="fly-photo absolute top-0 aspect-[3/4] overflow-hidden motion-reduce:hidden"
                style={{ left: spot.left, width: spot.width, transform: "translateY(110vh)" }}
                aria-hidden="true"
              >
                {/* Inner layer zooms on hover; the outer one is moved by GSAP. */}
                <div
                  className="h-full w-full transition-transform duration-700 ease-out hover:scale-110"
                  style={{ background: `${photoLayer(img.photo)}linear-gradient(150deg, ${img.palette[0]}, ${img.palette[1]})` }}
                />
              </div>
            );
          })}

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
    </section>
  );
}
