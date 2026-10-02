"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { performances } from "@/content/site";
import { useLanguage } from "./LanguageProvider";

/**
 * Art of Documentary "slide-over": a blurred full-screen photo sits behind the
 * text and cross-fades as each dance scrolls past. A small sharp thumbnail strip,
 * framed with corner brackets, shows which photo you are on.
 */
export function Performances() {
  const { lang, t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".perf-item").forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".perf-copy").forEach((copy) => {
          gsap.from(copy.children, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: copy, start: "top 75%" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="presentaciones" className="bg-paper text-ink">
      <header className="px-4 pb-16 pt-28 md:px-8 md:pt-40 lg:pl-48">
        <p className="label mb-6 text-mute">{t("navPerformances")}</p>
        <h2 className="display max-w-5xl text-[12vw] md:text-[6vw]">
          {t("performancesTitle")}{" "}
          <span className="font-serif font-normal tracking-normal text-mute">{t("performancesIntro")}</span>
        </h2>
      </header>

      <div className="relative">
        {/* Sticky layer: blurred backgrounds + thumbnail strip. */}
        <div className="sticky top-0 h-svh overflow-hidden">
          {performances.map((perf, i) => (
            <div
              key={perf.name}
              className="absolute inset-0 scale-110 blur-2xl transition-opacity duration-1000"
              style={{
                opacity: i === active ? 1 : 0,
                background: `linear-gradient(160deg, ${perf.palette[0]}, ${perf.palette[1]})`,
              }}
              aria-hidden="true"
            />
          ))}
          <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

          {/* Thumbnail rail. Signifiers: the current dance is framed and solid,
              the others are dimmed; hover lifts them, so they read as clickable.
              Each one is a link that jumps to its dance. */}
          <nav
            aria-label={t("navPerformances")}
            className="absolute bottom-8 right-8 hidden flex-col items-end gap-2 md:flex"
          >
            <p className="label mb-1 text-white" aria-hidden="true">
              {String(active + 1).padStart(2, "0")} / {String(performances.length).padStart(2, "0")}
            </p>
            {performances.map((perf, i) => {
              const current = i === active;
              return (
                <a
                  key={perf.name}
                  href={`#danza-${i + 1}`}
                  aria-label={perf.name}
                  aria-current={current ? "true" : undefined}
                  className="group relative block p-[5px]"
                >
                  {current && <Brackets />}
                  <span
                    className={`block transition-all duration-500 ${
                      current
                        ? "h-[84px] w-[64px] opacity-100"
                        : "h-[28px] w-[40px] opacity-40 group-hover:opacity-90 group-hover:w-[48px]"
                    }`}
                    style={{ background: `linear-gradient(160deg, ${perf.palette[0]}, ${perf.palette[1]})` }}
                  />
                </a>
              );
            })}
          </nav>
        </div>

        {/* Scrolling text, pulled up over the sticky layer. On desktop the empty
            space lets clicks through to the thumbnail rail underneath, while the
            name and description stay selectable. Mobile has no rail, so nothing changes. */}
        <div className="relative -mt-[100svh] md:pointer-events-none">
          {performances.map((perf, i) => (
            <article
              key={perf.name}
              id={`danza-${i + 1}`}
              className="perf-item flex min-h-svh items-center px-4 text-white md:px-8 lg:pl-48"
            >
              <div className="perf-copy grid w-full gap-6 md:grid-cols-[1fr_3fr]">
                <p className="label text-white/70">
                  {String(i + 1).padStart(2, "0")} — {perf.region[lang]}
                </p>
                <div>
                  <h3 className="display pointer-events-auto w-fit text-[16vw] md:text-[9vw]">{perf.name}</h3>
                  <p className="pointer-events-auto mt-6 max-w-md text-lg text-white/85 md:text-xl">{perf.description[lang]}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Brackets() {
  const corner = "absolute h-3 w-3 border-white";
  return (
    <>
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />
    </>
  );
}
