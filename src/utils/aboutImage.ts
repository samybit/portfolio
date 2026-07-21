export const getAboutImageIndex = (): number => {
  if (typeof window === "undefined") return 1;
  const currentVal = sessionStorage.getItem("aboutImageIndex");
  return currentVal ? parseInt(currentVal, 10) : 1;
};

export const cycleAboutImage = () => {
  if (typeof window === "undefined") return;
  const currentIndex = getAboutImageIndex();
  const nextIndex = (currentIndex % 4) + 1;
  sessionStorage.setItem("aboutImageIndex", nextIndex.toString());
  window.dispatchEvent(new CustomEvent("cycle-about-image"));
};
