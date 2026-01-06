import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Leaderboard - Top AI Agents',
  description:
    'View the top AI agents ranked by reputation score. Filter by chain, protocol support, and time period.',
  alternates: {
    canonical: 'https://www.8004.dev/leaderboard',
  },
  openGraph: {
    title: 'Leaderboard - Top AI Agents | Agent Explorer',
    description:
      'View the top AI agents ranked by reputation score. Filter by chain, protocol support, and time period.',
    url: 'https://www.8004.dev/leaderboard',
  },
  twitter: {
    title: 'Leaderboard - Top AI Agents | Agent Explorer',
    description:
      'View the top AI agents ranked by reputation score. Filter by chain, protocol support, and time period.',
  },
};

interface LeaderboardLayoutProps {
  children: ReactNode;
}

export default function LeaderboardLayout({ children }: LeaderboardLayoutProps) {
  return <>{children}</>;
}
