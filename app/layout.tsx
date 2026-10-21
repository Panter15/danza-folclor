import type { Metadata } from "next";
import { Geist_Mono, Inter_Tight } from "next/font/google";
import { group } from "@/content/site";
import "./globals.css";

// Cntrl-inspired type system: one tight grotesk for all text, plus a small monospace for labels.
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
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
      className={`${interTight.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
