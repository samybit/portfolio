import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://samyb.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
