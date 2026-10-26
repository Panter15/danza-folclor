"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { withBase } from "@/lib/photo";
import { useLanguage } from "./LanguageProvider";

// "Caimán Cienaguero". Git-ignored until the group has permission to publish it.
const SONG = "/music/caiman-cienaguero.mp3";
const VOLUME = 0.35;

// Off until clicked: browsers block sound before a click anyway, and a site that
// starts playing on its own is one of the quickest ways to make people leave.
export function SoundToggle() {
  const { t } = useLanguage();
  const audio = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);

  // Silence while the tab is in the background.
  useEffect(() => {
    const onVisibility = () => {
      const el = audio.current;
      if (!el || !on) return;
      if (document.hidden) el.pause();
      else el.play().catch(() => setOn(false));
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [on]);

  async function toggle() {
    const el = audio.current;
    if (!el) return;
    gsap.killTweensOf(el);
    if (on) {
      // Fade out instead of cutting the song off.
      gsap.to(el, { volume: 0, duration: 1, onComplete: () => el.pause() });
      setOn(false);
      return;
    }
    el.volume = 0;
    try {
      await el.play();
    } catch {
      return; // missing file or blocked: stay off
    }
    gsap.to(el, { volume: VOLUME, duration: 2 });
    setOn(true);
  }

  return (
    <>
      {/* preload="none": the song only downloads once someone asks for it. */}
      <audio ref={audio} src={withBase(SONG)} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        className={`label flex items-center gap-2 px-1 py-1 transition-opacity ${on ? "" : "opacity-60 hover:opacity-100"}`}
      >
        {/* Moving bars = sound is playing; flat bars crossed out = muted. */}
        <span aria-hidden="true" className="relative flex h-3 items-end gap-[2px]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-[2px] bg-current ${on ? "sound-bar" : "h-1"}`}
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
          {!on && <span className="absolute -inset-x-[3px] top-1/2 h-px -rotate-45 bg-current" />}
        </span>
        {t("music")}
      </button>
    </>
  );
}
