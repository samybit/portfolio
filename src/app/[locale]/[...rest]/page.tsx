import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CatchAllPage() {
  notFound();
}
