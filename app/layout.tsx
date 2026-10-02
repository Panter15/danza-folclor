import type { Metadata } from "next";
import { Geist_Mono, Goudy_Bookletter_1911, Inter_Tight } from "next/font/google";
import { group } from "@/content/site";
import "./globals.css";

// Cntrl-inspired type system: tight grotesk for headlines, an old-style serif
// for accent words, and a small monospace for labels.
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const goudy = Goudy_Bookletter_1911({
  variable: "--font-goudy",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${group.name} — Danza folclórica colombiana`,
  description:
    "Grupo de danza folclórica colombiana: presentaciones, giras nacionales e internacionales y contrataciones.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${interTight.variable} ${goudy.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
