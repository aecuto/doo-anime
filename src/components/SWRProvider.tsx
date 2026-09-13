"use client";

import { SWRConfig } from "swr";

export const SWRProvider = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig
    value={{
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      keepPreviousData: true,
    }}
  >
    {children}
  </SWRConfig>
);
