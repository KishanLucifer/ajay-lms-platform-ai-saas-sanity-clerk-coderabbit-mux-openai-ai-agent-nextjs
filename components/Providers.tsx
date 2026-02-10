"use client";

import dynamic from "next/dynamic";
import LoadingSpinner from "./LoadingSpinner";

const SanityAppProvider = dynamic(
  () => import("@/components/SanityAppProvider"),
  {
    ssr: false,
    loading: () => (
      <LoadingSpinner text="Loading Sanity App SDK..." isFullScreen size="lg" />
    ),
  },
);

export function Providers({ children }: { children: React.ReactNode }) {
  return <SanityAppProvider>{children}</SanityAppProvider>;
}
