import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import TabTitleUpdater from "@/components/TabTitleUpdater";
import { getDictionary, Locale } from "@/dictionaries/getDictionary";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <main className="min-h-screen overflow-x-hidden flex flex-col">
      <TabTitleUpdater dict={dict.tabTitles} />
      <Hero dict={dict.hero} />
      <Projects dict={dict.projects} />
      <CTA dict={dict.cta} />
      <Contact dict={dict.contact} />
    </main>
  );
}