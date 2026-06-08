import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import TabTitleUpdater from "@/components/TabTitleUpdater";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden flex flex-col">
      <TabTitleUpdater />
      <Hero />
      <Projects />
      <CTA />
      <Contact />
    </main>
  );
}