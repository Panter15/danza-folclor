"use client";

import { Fragment, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { group, heroTitles, heroVideo } from "@/content/site";
import { withBase } from "@/lib/photo";
import { useLanguage } from "./LanguageProvider";

const TITLE_HOLD = 5; // seconds a title stays readable
const VIDEO_ONLY = 1.5; // seconds of video alone between titles

export function Hero() {
  const { lang, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  const loaderBar = useRef<HTMLDivElement>(null);
  const loaderPct = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const vid = video.current;
      if (!vid) return;

      // Loading screen: fill the bar as the clip buffers, fade it out once it can play.
      // An error or a slow network (6 s) also lifts it, so the page is never stuck.
      let done = false;
      const hideLoader = () => {
        if (done) return;
        done = true;
        gsap.to(loaderBar.current, { scaleX: 1, duration: 0.3 });
        if (loaderPct.current) loaderPct.current.textContent = "100%";
        gsap.to(loader.current, { autoAlpha: 0, duration: 0.6, delay: 0.3 });
      };
      const onProgress = () => {
        if (done || !vid.duration || !vid.buffered.length) return;
        const share = Math.min(1, vid.buffered.end(vid.buffered.length - 1) / vid.duration);
        gsap.to(loaderBar.current, { scaleX: share, duration: 0.3, ease: "power2.out" });
        if (loaderPct.current) loaderPct.current.textContent = `${Math.round(share * 100)}%`;
      };
      vid.addEventListener("progress", onProgress);
      vid.addEventListener("canplaythrough", hideLoader);
      vid.addEventListener("error", hideLoader);
      const fallback = window.setTimeout(hideLoader, 6000);
      if (vid.readyState >= 4) hideLoader();

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Loops only while someone can see it: paused when the hero is scrolled off
        // screen or the tab is hidden, resumed on return. Reduced motion keeps the poster.
        let inView = true;
        const update = () => {
          if (inView && !document.hidden) vid.play().catch(() => {});
          else vid.pause();
        };
        const observer = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          update();
        });
        observer.observe(vid);
        document.addEventListener("visibilitychange", update);

        // Headline fades out as the page scrolls away.
        gsap.to(".hero-copy", {
          opacity: 0,
          y: -40,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "60% top", scrub: true },
        });
        // The scroll cue has done its job once the visitor starts scrolling.
        gsap.to(".scroll-cue", {
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "20% top", scrub: true },
        });

        return () => {
          observer.disconnect();
          document.removeEventListener("visibilitychange", update);
          vid.pause();
        };
      });

      return () => {
        vid.removeEventListener("progress", onProgress);
        vid.removeEventListener("canplaythrough", hideLoader);
        vid.removeEventListener("error", hideLoader);
        window.clearTimeout(fallback);
      };
    },
    { scope: root },
  );

  // Titles take turns: letters dance in, the title holds, flies out, then a moment of
  // video alone before the next one. Rebuilt for each title and on language change.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const chars = gsap.utils.toArray<HTMLElement>(".hero-char");
        const tilt = () => gsap.utils.random(-30, 30);
        gsap
          .timeline({ onComplete: () => setIndex((i) => (i + 1) % heroTitles.length) })
          .from(chars, { yPercent: -120, rotate: tilt, opacity: 0, duration: 0.8, ease: "back.out(2.2)", stagger: 0.035 })
          .to(chars, { yPercent: 120, rotate: tilt, opacity: 0, duration: 0.5, ease: "power2.in", stagger: 0.02 }, `+=${TITLE_HOLD}`)
          .to({}, { duration: VIDEO_ONLY });
        // One word sways gently, like a skirt, while the title is up.
        gsap.fromTo(".hero-sway", { rotate: -3 }, { rotate: 3, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 100%" });
      });
    },
    { scope: root, dependencies: [index, lang], revertOnUpdate: true },
  );

  const title = heroTitles[index];
  const lines = title.lines[lang];
  // Lines step across the width like a diagonal: first left, middle centred, last right.
  const align = (i: number) => (i === 0 ? "text-left" : i === lines.length - 1 ? "text-right" : "text-center");

  return (
    <section ref={root} id="top" className="relative h-svh overflow-hidden bg-paper">
      <div
        ref={loader}
        className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-paper text-ink"
        role="status"
        aria-live="polite"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized anyway */}
        <img src={withBase("/logo.webp")} alt={group.name} width={270} height={148} className="h-28 w-auto md:h-36" />
        <div className="h-px w-56 bg-line md:w-80" aria-hidden="true">
          <div ref={loaderBar} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
        </div>
        <p className="label text-mute">
          {t("loading")} <span ref={loaderPct}>0%</span>
        </p>
      </div>
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover"
        src={withBase(heroVideo.src)}
        poster={withBase(heroVideo.poster)}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      {/* Some clips are bright (white walls, daylight); shade them so the headline stays readable. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" aria-hidden="true" />

      {/* Right padding keeps the last line clear of the scroll cue. */}
      <div className="hero-copy absolute inset-x-0 bottom-0 pb-12 pl-4 pr-12 md:pl-8 md:pr-20 lg:pl-48" style={{ filter: "drop-shadow(0 4px 18px rgba(0,0,0,0.55))" }}>
        {/* Screen readers get the plain title; the letter spans are only for the animation. */}
        <h1 key={index} className="display text-[13vw] text-white md:text-[6.5vw]" aria-label={lines.join(" ")}>
          {lines.map((line, i) => (
            <span key={i} className={`block ${align(i)}`} aria-hidden="true">
              {line.split(" ").map((word, j) => (
                <Fragment key={j}>
                  {j > 0 && " "}
                  <span className={`inline-block ${word === title.sway[lang] ? "hero-sway" : ""}`}>
                    {[...word].map((ch, k) => (
                      <span key={k} className="hero-char inline-block">
                        {ch}
                      </span>
                    ))}
                  </span>
                </Fragment>
              ))}
            </span>
          ))}
        </h1>
      </div>

      {/* Signifier instead of a "scroll down" instruction: a dot travelling
          down a line says "there is more below" without any words. */}
      <div className="scroll-cue absolute bottom-10 right-6 h-14 w-px bg-white/30 md:right-8" aria-hidden="true">
        <span className="scroll-cue-dot absolute -left-[2px] top-0 h-[5px] w-[5px] rounded-full bg-white" />
      </div>
    </section>
  );
}
