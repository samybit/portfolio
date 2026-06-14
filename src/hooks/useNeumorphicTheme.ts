import { useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
};

const getSnapshot = () => {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("theme-neumorphic");
};

const getServerSnapshot = () => false;

export function useNeumorphicTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
