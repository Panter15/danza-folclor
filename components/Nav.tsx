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
        <a href="#top" className="display text-xl">
          {group.name}
        </a>
        {/* On large screens the side navigation takes over. */}
        <ul className="label hidden gap-6 md:flex lg:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="underline-offset-4 transition-opacity hover:underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        {/* Both languages visible, current one solid: matches the switcher people
            already know from other sites (mental model), so no label is needed. */}
        <div className="label flex items-center gap-1" role="group" aria-label="Idioma / Language">
          {(["es", "en"] as const).map((code, i) => (
            <span key={code} className="flex items-center gap-1">
              {i > 0 && <span className="opacity-40" aria-hidden="true">/</span>}
              <button
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`px-1 py-1 transition-opacity ${
                  lang === code ? "opacity-100 underline underline-offset-4" : "opacity-40 hover:opacity-80"
                }`}
              >
                {code.toUpperCase()}
              </button>
            </span>
          ))}
        </div>
      </nav>
    </header>
  );
}
