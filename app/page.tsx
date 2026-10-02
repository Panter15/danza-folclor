import { LanguageProvider } from "@/components/LanguageProvider";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Performances } from "@/components/Performances";
import { Tours } from "@/components/Tours";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <LanguageProvider>
      <Nav />
      <main>
        <Hero />
        <About />
        <Performances />
        <Tours />
        <Contact />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
