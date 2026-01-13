'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { RealtimeEventsProvider } from '@/providers/realtime-events-provider';
import { WalletProvider } from '@/providers/wallet-provider';

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
            // Agent data is relatively static - 60s staleTime reduces unnecessary refetches
            staleTime: 60 * 1000, // 60 seconds - agent data doesn't change frequently
            gcTime: 5 * 60 * 1000, // 5 minutes - keep cache for background updates
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: true, // Refresh when user returns to tab
            refetchOnMount: true, // Check for updates on component mount
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <RealtimeEventsProvider>{children}</RealtimeEventsProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}
