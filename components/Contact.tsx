"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { group } from "@/content/site";
import { useLanguage } from "./LanguageProvider";

export function Contact() {
  const { t } = useLanguage();
  const root = useRef<HTMLElement>(null);

  // WhatsApp click-to-chat: opens a chat with the group and a pre-filled message.
  const whatsappUrl = `https://wa.me/${group.whatsappNumber}?text=${encodeURIComponent(t("whatsappMessage"))}`;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".contact-reveal", {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contacto" className="bg-accent px-4 py-28 text-ink md:px-8 md:py-40">
      <h2 className="contact-reveal max-w-4xl font-display text-6xl leading-[0.95] md:text-8xl">
        {t("contactTitle")}
      </h2>
      <p className="contact-reveal mt-8 max-w-xl text-lg md:text-xl">{t("contactBody")}</p>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-reveal group mt-12 inline-flex items-center gap-4 rounded-full bg-ink px-8 py-5 text-paper transition-transform hover:scale-105"
      >
        <WhatsAppIcon />
        <span className="text-sm uppercase tracking-[0.2em]">{t("contactCta")}</span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </a>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z" />
    </svg>
  );
}
