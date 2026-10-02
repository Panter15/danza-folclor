"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLanguage } from "./LanguageProvider";

export function Hero() {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Intro: each line slides up out of its mask, one after another.
        gsap.from(".hero-line-inner", {
          yPercent: 110,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.12,
          delay: 0.2,
        });
        gsap.from(".hero-fade", { opacity: 0, y: 20, duration: 1, delay: 0.9, stagger: 0.1 });

        // On scroll: the background zooms in while the title drifts up and fades.
        gsap.to(".hero-media", {
          scale: 1.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-title", {
          yPercent: -30,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  const lines = [t("heroLine1"), t("heroLine2"), t("heroLine3")];

  return (
    <section ref={root} id="top" className="relative h-svh overflow-hidden bg-ink text-paper">
      {/* Placeholder for the real performance video: swap this div for a muted, looping <video>. */}
      <div className="hero-media absolute inset-0 hero-gradient" aria-hidden="true" />
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />

      <div className="hero-title relative z-10 flex h-full flex-col justify-end px-4 pb-16 md:px-8 md:pb-20">
        <p className="hero-fade mb-6 text-xs uppercase tracking-[0.3em] md:text-sm">{t("heroKicker")}</p>
        <h1 className="font-display text-[15vw] leading-[0.9] tracking-tight md:text-[10vw]">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <span className={`hero-line-inner block ${i === 1 ? "italic" : ""}`}>{line}</span>
            </span>
          ))}
        </h1>
        <p className="hero-fade mt-10 text-xs uppercase tracking-[0.3em] opacity-70">↓ {t("scroll")}</p>
      </div>
    </section>
  );
}
