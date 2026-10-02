"use client";

import { group } from "@/content/site";
import { useLanguage } from "./LanguageProvider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="overflow-hidden bg-ink px-4 pt-16 pb-6 text-paper md:px-8">
      <div className="flex flex-wrap justify-between gap-4 text-xs uppercase tracking-[0.3em] text-paper/60">
        <a href={group.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
          Instagram
        </a>
        <span>
          © {new Date().getFullYear()} {group.name}. {t("footerRights")}
        </span>
      </div>
      {/* Oversized name, inspired by the Victor Córdon footer. */}
      <p className="mt-10 font-display text-[10vw] leading-none tracking-tight" aria-hidden="true">
        {group.name}
      </p>
    </footer>
  );
}
