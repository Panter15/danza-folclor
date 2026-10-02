"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { heroSequence } from "@/content/site";
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
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const el = canvas.current;
      const ctx = el?.getContext("2d");
      if (!el || !ctx) return;

      // Keep the canvas sharp on high-DPI screens.
      const size = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        el.width = el.clientWidth * dpr;
        el.height = el.clientHeight * dpr;
      };

      // Real frames (Radian-style image sequence) if provided, otherwise the drawn pollera.
      const frames = heroSequence.map((src) => {
        const img = new Image();
        img.onload = () => render();
        img.src = src;
        return img;
      });

      const state = { p: 0 };
      const render = () => {
        if (frames.length) {
          const img = frames[Math.min(frames.length - 1, Math.round(state.p * (frames.length - 1)))];
          // A frame that failed to load is also "complete" but has no size; skip it.
          if (img.complete && img.naturalWidth > 0) {
            ctx.clearRect(0, 0, el.width, el.height);
            const scale = Math.max(el.width / img.width, el.height / img.height);
            const iw = img.width * scale;
            const ih = img.height * scale;
            ctx.drawImage(img, (el.width - iw) / 2, (el.height - ih) / 2, iw, ih);
          }
        } else {
          drawPollera(ctx, el.width, el.height, state.p);
        }
      };

      size();
      render();
      const onResize = () => {
        size();
        render();
      };
      window.addEventListener("resize", onResize);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Scroll scrubs the sequence while the hero stays pinned (sticky container).
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
        gsap.fromTo(
          ".hero-spin",
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "35% top", end: "55% top", scrub: true },
          },
        );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        state.p = 1;
        render();
        // Undo when the preference changes back, so the scrub starts from closed.
        return () => {
          state.p = 0;
        };
      });

      return () => window.removeEventListener("resize", onResize);
    },
    { scope: root },
  );

  const lines = [t("heroLine1"), t("heroLine2"), t("heroLine3")];

  return (
    <section ref={root} id="top" className="relative h-[300svh] bg-paper motion-reduce:h-svh">
      <div className="sticky top-0 h-svh overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />

        <div className="hero-copy absolute inset-x-0 bottom-0 px-4 pb-12 md:px-8 lg:pl-48">
          <p className="label mb-4 text-ink">{t("heroKicker")}</p>
          <h1 className="display text-[14vw] md:text-[8vw]">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.08em]">
                <span className={`hero-line-inner block ${i === 1 ? "font-serif font-normal tracking-normal text-mute" : ""}`}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <p className="hero-spin label absolute bottom-8 right-6 text-ink opacity-0 md:right-8">
          {t("heroSpin")} ↻
        </p>
      </div>
    </section>
  );
}
