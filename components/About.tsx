"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { stats } from "@/content/site";
import { useLanguage } from "./LanguageProvider";

export function About() {
  const { lang, t } = useLanguage();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Words light up one by one as the paragraph scrolls through the screen.
        gsap.fromTo(
          ".about-word",
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: { trigger: ".about-body", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );

        // Numbers count up when the stats row enters the screen.
        gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
          const target = Number(el.dataset.value);
          const counter = { value: 0 };
          gsap.to(counter, {
            value: target,
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
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  const items = [
    { value: stats.years, label: t("statYears"), suffix: "+" },
    { value: stats.countries, label: t("statCountries"), suffix: "" },
    { value: stats.shows, label: t("statShows"), suffix: "+" },
  ];

  return (
    <section ref={root} id="historia" className="bg-paper px-4 py-28 text-ink md:px-8 md:py-40">
      <p className="mb-10 text-xs uppercase tracking-[0.3em] text-ink/60">{t("aboutTitle")}</p>
      <p className="about-body max-w-5xl font-display text-3xl leading-tight md:text-5xl">
        {t("aboutBody")
          .split(" ")
          .map((word, i) => (
            <span key={`${word}-${i}`} className="about-word">
              {word}{" "}
            </span>
          ))}
      </p>

      <dl className="mt-20 grid gap-10 border-t border-ink/15 pt-10 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label}>
            <dd className="font-display text-6xl md:text-7xl">
              <span className="stat-number" data-value={item.value}>
                {item.value}
              </span>
              {item.suffix}
            </dd>
            <dt className="mt-2 text-xs uppercase tracking-[0.3em] text-ink/60">{item.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
