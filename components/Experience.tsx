"use client";

import { festivalsByYear, projects } from "@/content/site";
import { useLanguage } from "./LanguageProvider";

// Projects visible before "Ver todos"; the rest sit in a native <details>.
const PROJECTS_SHOWN = 5;

// "Trayectoria y experiencia" from the group's CV: festivals by year, projects carried out.
export function Experience() {
  const { lang, t } = useLanguage();

  const projectItem = (item: (typeof projects)[number]) => (
    <li key={item.es} className="py-3 text-base text-ink/80 md:text-lg">
      {item[lang]}
    </li>
  );

  return (
    <section
      id="trayectoria"
      className="border-t border-line bg-paper px-4 py-28 text-ink md:px-8 md:py-40 lg:pl-48"
    >
      <h2 className="display max-w-5xl text-[12vw] md:text-[6vw]">{t("experienceTitle")}</h2>

      <div className="mt-16 grid gap-16 md:grid-cols-2">
        <div>
          <p className="label text-accent">{t("festivalsIntro")}</p>
          <div className="mt-6 space-y-10">
            {festivalsByYear.map((group) => (
              <div key={group.year ?? "other"} className="grid gap-2 md:grid-cols-[6rem_1fr] md:gap-6">
                <h3 className="display text-4xl md:text-5xl">{group.year ?? t("otherYears")}</h3>
                <ul className="divide-y divide-line border-t border-line">
                  {group.items.map((name) => (
                    <li key={name} className="py-3 text-base text-ink/80 md:text-lg">
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="label text-accent">{t("projectsIntro")}</p>
          <ul className="mt-6 divide-y divide-line border-t border-line">
            {projects.slice(0, PROJECTS_SHOWN).map(projectItem)}
          </ul>
          <details className="group">
            <summary className="label my-6 inline-flex cursor-pointer list-none items-center gap-2 border border-ink px-4 py-2 transition-colors hover:bg-ink hover:text-paper [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">
                {t("showAll")} ({projects.length})
              </span>
              <span className="hidden group-open:inline">{t("showLess")}</span>
              <span aria-hidden="true" className="transition-transform group-open:rotate-180">
                ↓
              </span>
            </summary>
            <ul className="divide-y divide-line mt-6 border-t border-line">
              {projects.slice(PROJECTS_SHOWN).map(projectItem)}
            </ul>
          </details>
        </div>
      </div>
    </section>
  );
}
