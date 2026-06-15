import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://samyb.vercel.app'),
  verification: {
    google: "hV4rtyXu1OU2PEsZ2C9GnyTFakNpjmGILQvVWWV1Agc",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
