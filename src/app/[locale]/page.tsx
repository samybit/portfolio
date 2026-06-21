import TabTitleUpdater from "@/components/TabTitleUpdater";
import HomeClientWrapper from "@/components/HomeClientWrapper";
import { getDictionary, Locale } from "@/dictionaries/getDictionary";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <TabTitleUpdater dict={dict.tabTitles} />
      <HomeClientWrapper dict={dict} />
    </>
  );
}