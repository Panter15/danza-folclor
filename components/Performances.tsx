"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { performances } from "@/content/site";
import { useLanguage } from "./LanguageProvider";

export function Performances() {
  const { lang, t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const moveTo = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  useGSAP(
    () => {
      gsap.set(preview.current, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });

      // quickTo creates a reusable, smoothed setter: the preview "chases" the cursor.
      moveTo.current = {
        x: gsap.quickTo(preview.current, "x", { duration: 0.5, ease: "power3" }),
        y: gsap.quickTo(preview.current, "y", { duration: 0.5, ease: "power3" }),
      };

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".perf-row", {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".perf-list", start: "top 80%" },
        });
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      gsap.to(preview.current, {
        scale: active === null ? 0 : 1,
        opacity: active === null ? 0 : 1,
        duration: 0.4,
        ease: "power3.out",
      });
    },
    { dependencies: [active], scope: root },
  );

  const handleMouseMove = (event: React.MouseEvent) => {
    const bounds = root.current?.getBoundingClientRect();
    if (!bounds || !moveTo.current) return;
    moveTo.current.x(event.clientX - bounds.left);
    moveTo.current.y(event.clientY - bounds.top);
  };

  const current = active === null ? null : performances[active];

  return (
    <section
      ref={root}
      id="presentaciones"
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-ink px-4 py-28 text-paper md:px-8 md:py-40"
    >
      <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-5xl md:text-7xl">{t("performancesTitle")}</h2>
        <p className="hidden text-xs uppercase tracking-[0.3em] text-paper/50 md:block">
          {t("performancesHint")}
        </p>
      </div>

      <ul className="perf-list border-t border-paper/20" onMouseLeave={() => setActive(null)}>
        {performances.map((perf, i) => (
          <li
            key={perf.name}
            onMouseEnter={() => setActive(i)}
            className="perf-row group grid cursor-default grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 border-b border-paper/20 py-6 md:grid-cols-[4rem_1fr_1fr_auto] md:py-8"
          >
            <span className="text-xs text-paper/40">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-display text-4xl transition-transform duration-500 group-hover:translate-x-4 md:text-6xl">
              {perf.name}
            </span>
            <span className="col-start-2 text-sm text-paper/60 md:col-start-auto">{perf.description[lang]}</span>
            <span className="col-start-2 text-xs uppercase tracking-[0.3em] text-paper/50 md:col-start-auto">
              {perf.region[lang]}
            </span>
            {/* Mobile has no hover, so show the colour swatch inline instead. */}
            <span
              className="col-start-2 mt-2 h-24 rounded md:hidden"
              style={{ background: `linear-gradient(135deg, ${perf.palette[0]}, ${perf.palette[1]})` }}
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>

      {/* Floating preview that follows the cursor (desktop only). Swap the gradient for the real photo. */}
      <div
        ref={preview}
        className="pointer-events-none absolute left-0 top-0 hidden h-72 w-56 overflow-hidden rounded md:block"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        {current && (
          <div
            className="flex h-full w-full items-end p-4"
            style={{ background: `linear-gradient(160deg, ${current.palette[0]}, ${current.palette[1]})` }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-white mix-blend-difference">
              {current.name}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
