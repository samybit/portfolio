import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Quote from "@/components/Quote";
import Contact from "@/components/Contact";
import TabTitleUpdater from "@/components/TabTitleUpdater";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden flex flex-col">
      <TabTitleUpdater />
      <Hero />
      <Projects />
      <Quote />
      <Contact />
    </main>
  );
}