"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { group, heroVideo } from "@/content/site";
import { withBase } from "@/lib/photo";
import { useLanguage } from "./LanguageProvider";

export function Hero() {
  const { t } = useLanguage();
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

        // Headline slides up on load, then fades out as the page scrolls away.
        gsap.from(".hero-line-inner", { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: 0.1, delay: 0.2 });
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

  const lines = [t("heroLine1"), t("heroLine2"), t("heroLine3")];

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
      {/* The video is busy and dark at the bottom; shade it so the headline stays readable. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" aria-hidden="true" />

      <div className="hero-copy absolute inset-x-0 bottom-0 px-4 pb-12 md:px-8 lg:pl-48">
        <h1 className="display text-[14vw] text-white md:text-[8vw]">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <span className="hero-line-inner block">
                {line}
              </span>
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
