import NotFound from "../not-found";

export default function CatchAllPage() {
  // Directly rendering the NotFound component bypasses the Next.js notFound() exception router.
  // This completely eliminates the React 19 Turbopack Profiler "negative timestamp" crash
  // while guaranteeing the user sees the beautifully styled, localized 404 page!
  return <NotFound />;
}
