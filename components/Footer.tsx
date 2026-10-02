"use client";

import { useSyncExternalStore } from "react";
import { group } from "@/content/site";
import { useLanguage } from "./LanguageProvider";

const noopSubscribe = () => () => {};

export function Footer() {
  const { t } = useLanguage();
  // The page is pre-rendered at build time, so read the year in the browser
  // to avoid showing (and mismatching on) the build year.
  const year = useSyncExternalStore(
    noopSubscribe,
    () => new Date().getFullYear(),
    () => null,
  );

  return (
    <footer className="overflow-hidden bg-ink px-4 pt-16 pb-6 text-paper md:px-8">
      <div className="label flex flex-wrap justify-between gap-4 text-paper/60">
        <a href={group.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
          Instagram
        </a>
        <span>
          ©{year ? ` ${year}` : ""} {group.name}. {t("footerRights")}
        </span>
      </div>
      {/* Oversized name, inspired by the Victor Córdon and Cntrl footers. */}
      <p className="display mt-10 text-[11vw]" aria-hidden="true">
        {group.name}
      </p>
    </footer>
  );
}
