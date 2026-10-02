"use client";

import { group } from "@/content/site";
import { useLanguage } from "./LanguageProvider";

export function Nav() {
  const { lang, setLang, t } = useLanguage();

  const links = [
    { href: "#historia", label: t("navAbout") },
    { href: "#presentaciones", label: t("navPerformances") },
    { href: "#giras", label: t("navTours") },
    { href: "#contacto", label: t("navContact") },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference text-white">
      <nav className="flex items-center justify-between px-4 py-4 md:px-8">
        <a href="#top" className="font-display text-lg tracking-tight">
          {group.name}
        </a>
        <ul className="hidden gap-6 text-sm uppercase tracking-widest md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:opacity-60 transition-opacity">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setLang(lang === "es" ? "en" : "es")}
          className="rounded-full border border-white/60 px-3 py-1 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          aria-label={lang === "es" ? "Switch to English" : "Cambiar a español"}
        >
          {lang === "es" ? "EN" : "ES"}
        </button>
      </nav>
    </header>
  );
}
