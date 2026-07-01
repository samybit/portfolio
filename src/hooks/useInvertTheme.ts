import { useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
};

const getSnapshot = () => {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("invert-theme");
};

const getServerSnapshot = () => false;

export function useInvertTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
