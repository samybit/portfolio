"use client";

import { useAnimationConfig } from "@/context/AnimationContext";
import ReaderModeView from "@/components/ReaderModeView";

interface ReaderModeWrapperProps {
  children: React.ReactNode;
  // The full dictionary from the server component (layout)
  dict: Record<string, Record<string, unknown>>;
  locale: string;
}

export default function ReaderModeWrapper({ children, dict, locale }: ReaderModeWrapperProps) {
  const { isReaderMode, toggleReaderMode } = useAnimationConfig();

  if (isReaderMode) {
    return <ReaderModeView dict={dict} locale={locale} onExit={toggleReaderMode} />;
  }

  return <>{children}</>;
}
