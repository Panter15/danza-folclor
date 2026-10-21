"use client";

import { festivals, projects } from "@/content/site";
import { useLanguage } from "./LanguageProvider";

// "Trayectoria y experiencia" from the group's CV: projects carried out and festivals attended.
export function Experience() {
  const { lang, t } = useLanguage();

  return (
    <section
      id="trayectoria"
      className="border-t border-line bg-paper px-4 py-28 text-ink md:px-8 md:py-40 lg:pl-48"
    >
      <h2 className="display max-w-5xl text-[12vw] md:text-[6vw]">{t("experienceTitle")}</h2>

      <div className="mt-16 grid gap-16 md:grid-cols-2">
        <div>
          <p className="label text-accent">{t("projectsIntro")}</p>
          <ul className="mt-6 divide-y divide-line border-t border-line">
            {projects.map((item) => (
              <li key={item.es} className="py-3 text-base text-ink/80 md:text-lg">
                {item[lang]}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label text-accent">{t("festivalsIntro")}</p>
          <ul className="mt-6 divide-y divide-line border-t border-line">
            {festivals.map((name) => (
              <li key={name} className="py-3 text-base text-ink/80 md:text-lg">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
