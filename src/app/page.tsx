'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PixelExplorer } from '@/components/atoms';
import { SearchInput } from '@/components/molecules';
import { StatsGrid } from '@/components/organisms';
import { useStats } from '@/hooks';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: stats, isLoading: statsLoading, error: statsError } = useStats();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-pixel-grid">
      {/* Header with navigation */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--pixel-gray-800)]">
        <span className="text-pixel-body text-sm text-[var(--pixel-gray-400)]">8004.dev</span>
        <nav>
          <Link
            href="/explore"
            className="text-pixel-body text-sm text-[var(--pixel-blue-sky)] hover:text-glow-blue"
          >
            Explore
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-8">
          {/* Hero Title with Explorer */}
          <div className="flex flex-col items-center gap-4">
            <PixelExplorer size="lg" animation="float" />
            <h1 className="text-pixel-display text-2xl md:text-4xl text-[var(--pixel-blue-sky)] text-glow-blue">
              AGENT EXPLORER
            </h1>
          </div>

          {/* Status Badge - derived from stats query */}
          {statsLoading ? (
            <div className="inline-flex items-center gap-2 badge-pixel text-[var(--pixel-gray-400)] border-[var(--pixel-gray-400)]">
              <span className="w-2 h-2 bg-[var(--pixel-gray-400)] animate-pulse" />
              <span>CHECKING...</span>
            </div>
          ) : statsError ? (
            <div className="inline-flex items-center gap-2 badge-pixel text-[var(--pixel-red-fire)] border-[var(--pixel-red-fire)] glow-red">
              <span className="w-2 h-2 bg-[var(--pixel-red-fire)] animate-pulse" />
              <span>SYSTEM OFFLINE</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 badge-pixel text-[var(--pixel-green-pipe)] border-[var(--pixel-green-pipe)] glow-green">
              <span className="w-2 h-2 bg-[var(--pixel-green-pipe)] animate-glow-pulse" />
              <span>SYSTEM ONLINE</span>
            </div>
          )}

          {/* Subtitle */}
          <p className="text-pixel-body text-sm md:text-base text-[var(--pixel-gray-200)] max-w-xl mx-auto">
            Discover and explore autonomous AI agents registered on the ERC-8004 standard
          </p>

          {/* Search Input + Buttons grouped */}
          <div className="pt-4 space-y-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
              placeholder="Search agents by name..."
              className="max-w-md mx-auto"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/explore" className="btn-pixel-primary">
                ADVANCED SEARCH
              </Link>
              <button type="button" className="btn-pixel-secondary">
                LEARN MORE
              </button>
            </div>
          </div>

          {/* Platform Statistics */}
          <div className="pt-12 space-y-4 w-full max-w-3xl mx-auto">
            <p className="text-pixel-body text-xs text-[var(--pixel-gray-400)]">
              PLATFORM STATISTICS
            </p>
            <StatsGrid stats={stats} isLoading={statsLoading} error={statsError?.message} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center space-y-2 border-t border-[var(--pixel-gray-800)]">
        <p className="text-pixel-body text-xs text-[var(--pixel-gray-400)]">
          Powered by{' '}
          <a
            href="https://eips.ethereum.org/EIPS/eip-8004"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--pixel-blue-sky)] hover:text-glow"
          >
            ERC-8004
          </a>{' '}
          Trustless Agents
        </p>
        <p className="text-pixel-body text-xs text-[var(--pixel-gray-400)]">
          Built with{' '}
          <a
            href="https://github.com/agent0lab"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--pixel-gold-coin)] hover:text-glow"
          >
            Agent0 Lab
          </a>{' '}
          open-source tools
        </p>
      </footer>
    </div>
  );
}
