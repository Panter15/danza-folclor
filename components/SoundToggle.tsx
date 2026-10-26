"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { withBase } from "@/lib/photo";
import { useLanguage } from "./LanguageProvider";

// "Caimán Cienaguero". Git-ignored until the group has permission to publish it.
const SONG = "/music/caiman-cienaguero.mp3";
const VOLUME = 0.35;
const MUTED_KEY = "ancestros-muted";

// Starts by itself: browsers block sound until the visitor interacts, so it tries
// on load and otherwise starts on the first click, tap or key press. A visitor who
// mutes it is remembered and not autoplayed again.
export function SoundToggle() {
  const { t } = useLanguage();
  const audio = useRef<HTMLAudioElement>(null);
  // Mirrors the audio element (its play/pause events), so the button is always truthful.
  const [on, setOn] = useState(false);
  // What the visitor wants, kept apart from playback: hiding the tab pauses but doesn't mute.
  const wanted = useRef(false);
  const [missing, setMissing] = useState(false);

  async function start() {
    const el = audio.current;
    if (!el) return false;
    wanted.current = true;
    gsap.killTweensOf(el);
    el.volume = 0;
    try {
      await el.play();
    } catch {
      return false; // blocked until the visitor interacts, or the file is missing
    }
    gsap.to(el, { volume: VOLUME, duration: 2 });
    return true;
  }

  function stop() {
    const el = audio.current;
    if (!el) return;
    wanted.current = false;
    gsap.killTweensOf(el);
    // Fade out instead of cutting the song off.
    gsap.to(el, { volume: 0, duration: 1, onComplete: () => el.pause() });
  }

  useEffect(() => {
    let muted = false;
    try {
      muted = localStorage.getItem(MUTED_KEY) === "1";
    } catch {}
    if (muted) return;

    const events = ["pointerdown", "keydown", "touchend"] as const;
    const stopListening = () => events.forEach((name) => window.removeEventListener(name, onFirstInteraction, true));
    const onFirstInteraction = (e: Event) => {
      // A first click on the Música button is left to the button; starting here too
      // would make its click see "on" and mute it straight away. A missing song: give up.
      if ((e.target as Element | null)?.closest?.("[data-music-toggle]") || audio.current?.error) return stopListening();
      if (wanted.current || !audio.current?.paused) return stopListening();
      // Keep listening until it really starts: a scroll swipe on a phone is an
      // interaction too, but browsers don't count it as permission for sound.
      start().then((ok) => {
        if (ok) stopListening();
        else wanted.current = false;
      });
    };
    start().then((ok) => {
      if (!ok) {
        wanted.current = false;
        events.forEach((e) => window.addEventListener(e, onFirstInteraction, { capture: true }));
      }
    });
    return () => events.forEach((e) => window.removeEventListener(e, onFirstInteraction, true));
  }, []);

  // Silence while the tab is in the background, resume when it comes back.
  useEffect(() => {
    const onVisibility = () => {
      const el = audio.current;
      if (!el || !wanted.current) return;
      if (document.hidden) el.pause();
      else el.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  function toggle() {
    const mute = wanted.current;
    try {
      localStorage.setItem(MUTED_KEY, mute ? "1" : "0");
    } catch {}
    if (mute) stop();
    else start();
  }

  return (
    <>
      {/* preload="none": the 6 MB song downloads only when it is actually played. */}
      <audio
        ref={audio}
        src={withBase(SONG)}
        loop
        preload="none"
        onPlay={() => setOn(true)}
        onPause={() => setOn(false)}
        onError={() => setMissing(true)}
      />
      {/* No song file (e.g. not published yet): no button rather than one that does nothing. */}
      {!missing && (
        <button
          data-music-toggle
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
      )}
    </>
  );
}
