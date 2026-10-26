"use client";

import { useSyncExternalStore } from "react";
import { group } from "@/content/site";
import { withBase } from "@/lib/photo";
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
      {/* Right-aligned so nothing sits under the fixed side nav. */}
      <div className="label flex flex-col items-end gap-3 text-right text-paper/60">
        {/* Light backing: the logo's dark outline would vanish on the black footer. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized anyway */}
        <img src={withBase("/logo.webp")} alt={group.name} width={270} height={148} className="mb-4 h-24 w-auto rounded-2xl bg-paper p-3" />
        <span>
          ©{year ? ` ${year}` : ""} {group.name}. {t("footerRights")}
        </span>
        <a href={group.instagram} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-paper hover:underline">
          Instagram
        </a>
        <a href={group.facebook} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-paper hover:underline">
          Facebook
        </a>
      </div>
      {/* Oversized name, inspired by the Victor Córdon and Cntrl footers. */}
      <p className="display mt-10 text-[11vw]" aria-hidden="true">
        {group.name}
      </p>
    </footer>
  );
}
