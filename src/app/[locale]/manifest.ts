import { MetadataRoute } from 'next';

export default async function manifest({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<MetadataRoute.Manifest> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  return {
    name: isArabic ? 'سامي برسوم | مطور Full-Stack' : 'Samy Barsoum | Full-Stack Developer',
    short_name: isArabic ? 'سامي Dev' : 'Samy Dev',
    description: isArabic 
      ? 'مطور Full-Stack متخصص في Next.js و React و MERN Stack.' 
      : 'Full-Stack Developer specializing in Next.js, React, and the MERN stack.',
    start_url: `/${locale}`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
