"use client";

import { useState } from "react";
import { festivalsByYear, projects } from "@/content/site";
import { useLanguage } from "./LanguageProvider";

// Projects visible before "Ver todos".
const PROJECTS_SHOWN = 5;

// "Trayectoria y experiencia" from the group's CV: festivals by year, projects carried out.
export function Experience() {
  const { lang, t } = useLanguage();
  const [showAll, setShowAll] = useState(false);

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
          <h3 className="display text-3xl md:text-4xl">{t("festivalsTitle")}</h3>
          <p className="label mt-3 text-accent">{t("festivalsIntro")}</p>
          <div className="mt-6 space-y-10">
            {festivalsByYear.map((group) => (
              <div key={group.year ?? "other"} className="grid gap-2 md:grid-cols-[6rem_1fr] md:gap-6">
                <h4 className="display text-4xl md:text-5xl">{group.year ?? t("otherYears")}</h4>
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
          <h3 className="display text-3xl md:text-4xl">{t("projectsTitle")}</h3>
          <p className="label mt-3 text-accent">{t("projectsIntro")}</p>
          <ul className="mt-6 divide-y divide-line border-t border-line">
            {(showAll ? projects : projects.slice(0, PROJECTS_SHOWN)).map(projectItem)}
          </ul>
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            aria-expanded={showAll}
            className="label mt-6 inline-flex items-center gap-2 border border-ink px-4 py-2 transition-colors hover:bg-ink hover:text-paper"
          >
            {showAll ? t("showLess") : `${t("showAll")} (${projects.length})`}
            <span aria-hidden="true" className={`transition-transform ${showAll ? "rotate-180" : ""}`}>
              ↓
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
