"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { group, heroVideo } from "@/content/site";
import { withBase } from "@/lib/photo";
import { useLanguage } from "./LanguageProvider";

// Pollera trim colours, outermost ruffle first.
const RUFFLES = ["#FCD116", "#003893", "#CE1126", "#FFFFFF", "#FCD116", "#CE1126"];

/**
 * Draws a pollera (folk skirt) seen from above. `p` is scroll progress 0..1:
 * the skirt opens from closed to fully spread while it spins.
 */
function drawPollera(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.min(w, h) * 0.44;
  const open = 0.18 + 0.82 * easeOutCubic(p);
  const spin = p * Math.PI * 4;

  RUFFLES.forEach((color, i) => {
    const ringR = maxR * open * (1 - i / (RUFFLES.length + 1));
    const waves = 14 + i * 2;
    const depth = 0.05 + 0.05 * p;
    const turn = spin * (i % 2 === 0 ? 1 : -0.6);

    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 180) {
      const r = ringR * (1 + depth * Math.sin(a * waves + turn * 3));
      const x = cx + r * Math.cos(a + turn);
      const y = cy + r * Math.sin(a + turn);
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = "rgba(0,0,0,0.18)";
    ctx.shadowBlur = 24;
    ctx.fill();
  });

  // The dancer at the centre.
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(cx, cy, maxR * 0.07, 0, Math.PI * 2);
  ctx.fillStyle = "#0a0a0a";
  ctx.fill();
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

export function Hero() {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const skirt = useRef<HTMLCanvasElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  const loaderBar = useRef<HTMLDivElement>(null);
  const loaderPct = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const vid = video.current;
      const skirtEl = skirt.current;
      const skirtCtx = skirtEl?.getContext("2d");
      if (!vid || !skirtEl || !skirtCtx) return;

      // Keep the canvas sharp on high-DPI screens.
      const size = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        skirtEl.width = skirtEl.clientWidth * dpr;
        skirtEl.height = skirtEl.clientHeight * dpr;
      };

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

      // The pollera spins open in the corner as you scroll, over the video.
      const state = { p: 0 };
      const render = () => drawPollera(skirtCtx, skirtEl.width, skirtEl.height, state.p);

      size();
      render();
      const onResize = () => {
        size();
        render();
      };
      window.addEventListener("resize", onResize);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Plays once (no loop) and rests on its last frame: movement on arrival,
        // then calm, and no more data used. Reduced motion keeps the poster.
        vid.play().catch(() => {});

        // Scroll opens the corner skirt while the hero stays pinned (sticky container).
        // fromTo (not to) so the scrub always starts closed, even after the
        // reduced-motion branch below has set p = 1.
        gsap.fromTo(state, { p: 0 }, {
          p: 1,
          ease: "none",
          onUpdate: render,
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });

        // Headline slides up on load, then fades out as the skirt opens.
        gsap.from(".hero-line-inner", { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: 0.1, delay: 0.2 });
        gsap.to(".hero-copy", {
          opacity: 0,
          y: -40,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "30% top", scrub: true },
        });
        // The scroll cue has done its job once the visitor starts scrolling.
        gsap.to(".scroll-cue", {
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "8% top", scrub: true },
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        state.p = 1;
        render();
        // Undo when the preference changes back, so the scrub starts from closed.
        return () => {
          state.p = 0;
        };
      });

      return () => {
        window.removeEventListener("resize", onResize);
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
    <section ref={root} id="top" className="relative h-[300svh] bg-paper motion-reduce:h-svh">
      <div
        ref={loader}
        className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-paper text-ink"
        role="status"
        aria-live="polite"
      >
        <p className="display text-3xl md:text-5xl">{group.name}</p>
        <div className="h-px w-56 bg-line md:w-80" aria-hidden="true">
          <div ref={loaderBar} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
        </div>
        <p className="label text-mute">
          {t("loading")} <span ref={loaderPct}>0%</span>
        </p>
      </div>
      <div className="sticky top-0 h-svh overflow-hidden">
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          src={withBase(heroVideo.src)}
          poster={withBase(heroVideo.poster)}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <canvas
          ref={skirt}
          className="absolute right-[4%] top-[12%] aspect-square w-[40vw] md:w-[24vw]"
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
      </div>
    </section>
  );
}
