import type { Metadata } from "next";
import { getDictionary, Locale } from "@/dictionaries/getDictionary";
import CvClient from "@/components/CvClient";
import TabTitleUpdater from "@/components/TabTitleUpdater";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  const baseUrl = 'https://samyb.vercel.app';

  return {
    title: isArabic ? 'السيرة الذاتية' : 'Curriculum Vitae (CV)',
    description: isArabic
      ? 'السيرة الذاتية لسامي برسوم — مطور برمجيات و Full-Stack Developer. استعرض وحمل ملف الـ PDF.'
      : 'Samy Barsoum CV / Resume — Full-Stack Software Engineer specializing in Next.js, React, and MERN stack. View and download PDF.',
    alternates: {
      canonical: `/${locale}/cv`,
      languages: {
        'en': '/en/cv',
        'ar': '/ar/cv',
      },
    },
    openGraph: {
      title: isArabic ? 'السيرة الذاتية | سامي برسوم' : 'Curriculum Vitae (CV) | Samy Barsoum',
      description: isArabic
        ? 'السيرة الذاتية لسامي برسوم — مطور برمجيات و Full-Stack Developer. استعرض وحمل ملف الـ PDF.'
        : 'Samy Barsoum CV / Resume — Full-Stack Software Engineer specializing in Next.js, React, and MERN stack.',
      url: `${baseUrl}/${locale}/cv`,
      type: 'website',
      siteName: isArabic ? 'سامي | معرض أعمال المطور' : 'Samy | Developer Portfolio',
      locale: isArabic ? 'ar_EG' : 'en_US',
      images: [
        {
          url: `${baseUrl}/og-cv.jpg`,
          width: 1200,
          height: 630,
          alt: isArabic ? 'السيرة الذاتية - سامي برسوم' : 'Samy Barsoum - Curriculum Vitae (CV)',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isArabic ? 'السيرة الذاتية | سامي برسوم' : 'Curriculum Vitae (CV) | Samy Barsoum',
      description: isArabic
        ? 'السيرة الذاتية لسامي برسوم — مطور برمجيات و Full-Stack Developer. استعرض وحمل ملف الـ PDF.'
        : 'Samy Barsoum CV / Resume — Full-Stack Software Engineer specializing in Next.js, React, and MERN stack.',
      images: [`${baseUrl}/og-cv.jpg`],
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function CvPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <TabTitleUpdater dict={dict.tabTitles} />
      <CvClient dict={dict.cv} footerDict={dict.footer} locale={locale} />
    </>
  );
}
