"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageProvider";

// Off until clicked: browsers block sound before a click anyway, and a site that
// starts playing on its own is one of the quickest ways to make people leave.
export function SoundToggle() {
  const { t } = useLanguage();
  const [on, setOn] = useState(false);

  async function toggle() {
    const music = await import("@/lib/music"); // Tone.js only loads when wanted
    if (on) music.stopMusic();
    else await music.startMusic();
    setOn(!on);
  }

  return (
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
  );
}
