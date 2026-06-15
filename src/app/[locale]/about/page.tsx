import type { Metadata } from "next";
import { getDictionary, Locale } from "@/dictionaries/getDictionary";
import AboutClient from "@/components/AboutClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  return {
    title: isArabic ? 'عني' : 'About',
    description: isArabic
      ? 'تعرف على سامي برسوم — مطور Full-Stack متخصص في MERN Stack، خريج جامعة عين شمس، حاصل على شهادة CS50x من Harvard.'
      : 'Learn about Samy Barsoum — a Full-Stack Developer specializing in the MERN stack, Ain Shams University graduate, and CS50x certified by Harvard.',
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        'en': '/en/about',
        'ar': '/ar/about',
      },
    },
    openGraph: {
      title: isArabic ? 'عني | سامي برسوم' : 'About | Samy Barsoum',
      description: isArabic
        ? 'تعرف على سامي برسوم — مطور Full-Stack متخصص في MERN Stack.'
        : 'Learn about Samy Barsoum — a Full-Stack Developer specializing in the MERN stack.',
      url: `https://samyb.vercel.app/${locale}/about`,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return <AboutClient dict={dict.about} tabTitles={dict.tabTitles} locale={locale} />;
}
