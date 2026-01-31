import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from "@/constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export function ReactQueryLayout({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: DEFAULT_GC_TIME,
        staleTime: DEFAULT_STALE_TIME,
      },
    },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
