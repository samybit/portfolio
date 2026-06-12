import { getDictionary, Locale } from "@/dictionaries/getDictionary";
import AboutClient from "@/components/AboutClient";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return <AboutClient dict={dict.about} tabTitles={dict.tabTitles} locale={locale} />;
}
