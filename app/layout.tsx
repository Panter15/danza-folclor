import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { group } from "@/content/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${group.name} — Danza folclórica colombiana`,
  description:
    "Grupo de danza folclórica colombiana: presentaciones, giras nacionales e internacionales y contrataciones.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
