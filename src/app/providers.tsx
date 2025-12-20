'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale-while-revalidate defaults
            // Reduced from 30s to 10s to minimize stale empty results
            staleTime: 10 * 1000, // 10 seconds - consider stale quickly for fresher data
            gcTime: 5 * 60 * 1000, // 5 minutes - keep cache for background updates
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: true, // Refresh when user returns to tab
            refetchOnMount: true, // Check for updates on component mount
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
