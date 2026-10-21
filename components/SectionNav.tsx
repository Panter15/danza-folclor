"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { sections } from "@/content/site";
import { useLanguage } from "./LanguageProvider";

// Radian-style "where am I" list: fixed on the left, the current section is
// solid and the rest are faded. A thin line fills with overall page progress.
export function SectionNav() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const line = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const targets = sections.map((section) => document.getElementById(section.id));

    ScrollTrigger.create({
      start: 0,
      end: "max",
      // Compute after pinned sections (Tours) so their extra scroll space is included.
      refreshPriority: -1,
      onUpdate: (self) => {
        // Set the style directly instead of using state, so scrolling does not re-render.
        gsap.set(line.current, { scaleY: self.progress });
        // Current section = the last one whose top has passed the middle of the screen.
        // Unlike per-section enter/leave, this stays right after jumps and over the footer.
        const middle = window.innerHeight / 2;
        let current = 0;
        targets.forEach((el, i) => {
          if (el && el.getBoundingClientRect().top <= middle) current = i;
        });
        setActive(current);
        // Keep the URL in step with the section on screen, so a copied link or a
        // reload lands in the same place. replaceState: no jump, no history entry per section.
        const hash = current === 0 ? "" : `#${sections[current].id}`;
        if (window.location.hash !== hash) {
          history.replaceState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
        }
      },
    });
  });

  return (
    <nav
      aria-label="Secciones"
      className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 text-white mix-blend-difference lg:block"
    >
      <div className="flex gap-4">
        <div className="relative w-px bg-white/25" aria-hidden="true">
          <div ref={line} className="absolute inset-0 origin-top bg-white" style={{ transform: "scaleY(0)" }} />
        </div>
        <ol className="pointer-events-auto flex flex-col gap-3">
          {sections.map((section, i) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={i === active ? "true" : undefined}
                className={`label flex items-center gap-2 transition-opacity duration-500 ${
                  i === active ? "opacity-100" : "opacity-35 hover:opacity-70"
                }`}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span
                  className={`h-px bg-white transition-all duration-500 ${i === active ? "w-6" : "w-0"}`}
                  aria-hidden="true"
                />
                <span>{t(section.labelKey)}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
