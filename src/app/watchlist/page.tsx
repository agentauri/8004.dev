/**
 * Watchlist Page
 *
 * Displays all watched agents with filtering, change notifications, and export capabilities.
 */

'use client';

import { Bell, Download, Eye, Search, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import type { ChainId } from '@/components/atoms';
import { WatchlistPanel } from '@/components/organisms';
import { MainLayout } from '@/components/templates';
import { useWatchlist } from '@/hooks';

type SortOption = 'recent' | 'name' | 'chain' | 'changed';

export default function WatchlistPage() {
  const {
    watchlist,
    watchCount,
    isAtLimit,
    removeFromWatchlist,
    clearWatchlist,
    setAgentNotes,
    getRecentlyChanged,
    exportWatchlist,
    importWatchlist,
  } = useWatchlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState<ChainId | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showOnlyChanged, setShowOnlyChanged] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const recentlyChanged = getRecentlyChanged();
  const changedCount = recentlyChanged.length;

  // Get unique chains from watchlist
  const uniqueChains = useMemo(() => {
    const chains = new Set(watchlist.map((a) => a.chainId));
    return Array.from(chains).sort() as ChainId[];
  }, [watchlist]);

  // Filter and sort watchlist
  const filteredWatchlist = useMemo(() => {
    let result = [...watchlist];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.description?.toLowerCase().includes(query) ||
          a.agentId.includes(query) ||
          a.notes?.toLowerCase().includes(query),
      );
    }

    // Filter by chain
    if (selectedChain !== null) {
      result = result.filter((a) => a.chainId === selectedChain);
    }

    // Filter by changed only
    if (showOnlyChanged) {
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      result = result.filter((a) => a.lastChangeAt && a.lastChangeAt >= cutoff);
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'chain':
        result.sort((a, b) => a.chainId - b.chainId);
        break;
      case 'changed':
        result.sort((a, b) => (b.lastChangeAt ?? 0) - (a.lastChangeAt ?? 0));
        break;
      default:
        // 'recent' is the default sort order
        result.sort((a, b) => b.watchedAt - a.watchedAt);
    }

    return result;
  }, [watchlist, searchQuery, selectedChain, sortBy, showOnlyChanged]);

  const handleExport = useCallback(() => {
    const data = exportWatchlist();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-explorer-watchlist-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportWatchlist]);

  const handleImport = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setImportError(null);
      setImportSuccess(null);

      try {
        const text = await file.text();
        const result = importWatchlist(text);

        if (result.errors > 0 && result.imported === 0) {
          setImportError('Import failed. Invalid file format.');
        } else if (result.errors > 0) {
          setImportSuccess(
            `Imported ${result.imported} agents. ${result.errors} skipped (duplicates or invalid).`,
          );
        } else {
          setImportSuccess(`Successfully imported ${result.imported} agents.`);
        }
      } catch {
        setImportError('Failed to read file.');
      }

      // Reset file input
      event.target.value = '';
    },
    [importWatchlist],
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-pixel-grid">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Page Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-[var(--pixel-blue-sky)]" aria-hidden="true" />
                <h1 className="font-[family-name:var(--font-pixel-display)] text-2xl md:text-3xl text-[var(--pixel-gray-100)]">
                  Watchlist
                </h1>
                <span className="text-sm text-[var(--pixel-gray-400)]">
                  {watchCount}/50 {isAtLimit && '(Full)'}
                </span>
                {changedCount > 0 && (
                  <span className="flex items-center gap-1 px-2 py-1 text-xs bg-[var(--pixel-gold-coin)]/20 text-[var(--pixel-gold-coin)] border border-[var(--pixel-gold-coin)]">
                    <Bell className="w-3 h-3" />
                    {changedCount} changed
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm border-2 border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-blue-text)] hover:text-[var(--pixel-blue-text)] transition-colors cursor-pointer"
                  aria-label="Import watchlist"
                >
                  <Upload size={16} aria-hidden="true" />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="sr-only"
                    data-testid="import-input"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={watchlist.length === 0}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm border-2 border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-blue-text)] hover:text-[var(--pixel-blue-text)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Export watchlist"
                >
                  <Download size={16} aria-hidden="true" />
                  Export
                </button>
              </div>
            </div>
            <p className="text-[var(--pixel-gray-400)] max-w-2xl">
              Monitor agents for reputation and status changes. Watchlist is stored locally in your
              browser.
            </p>
          </header>

          {/* Import/Export Messages */}
          {importError && (
            <div className="mb-4 p-3 bg-[rgba(252,84,84,0.1)] border-2 border-[var(--pixel-red-fire)] text-[var(--pixel-red-fire)] text-sm flex items-center justify-between">
              <span>{importError}</span>
              <button
                type="button"
                onClick={() => setImportError(null)}
                className="hover:opacity-70"
                aria-label="Dismiss error"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          )}
          {importSuccess && (
            <div className="mb-4 p-3 bg-[rgba(0,216,0,0.1)] border-2 border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)] text-sm flex items-center justify-between">
              <span>{importSuccess}</span>
              <button
                type="button"
                onClick={() => setImportSuccess(null)}
                className="hover:opacity-70"
                aria-label="Dismiss message"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Filters */}
          {watchlist.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pixel-gray-500)]"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search watchlist..."
                  className="w-full pl-10 pr-4 py-2 bg-[var(--pixel-gray-900)] border-2 border-[var(--pixel-gray-700)] text-[var(--pixel-gray-200)] placeholder-[var(--pixel-gray-500)] focus:border-[var(--pixel-blue-text)] focus:outline-none"
                  data-testid="search-input"
                />
              </div>

              {/* Chain Filter */}
              <select
                value={selectedChain ?? ''}
                onChange={(e) =>
                  setSelectedChain(e.target.value ? (Number(e.target.value) as ChainId) : null)
                }
                className="px-3 py-2 bg-[var(--pixel-gray-900)] border-2 border-[var(--pixel-gray-700)] text-[var(--pixel-gray-200)] focus:border-[var(--pixel-blue-text)] focus:outline-none"
                data-testid="chain-filter"
              >
                <option value="">All chains</option>
                {uniqueChains.map((chainId) => (
                  <option key={chainId} value={chainId}>
                    Chain {chainId}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 bg-[var(--pixel-gray-900)] border-2 border-[var(--pixel-gray-700)] text-[var(--pixel-gray-200)] focus:border-[var(--pixel-blue-text)] focus:outline-none"
                data-testid="sort-select"
              >
                <option value="recent">Most Recent</option>
                <option value="changed">Recently Changed</option>
                <option value="name">Name A-Z</option>
                <option value="chain">By Chain</option>
              </select>

              {/* Show Only Changed */}
              <label className="inline-flex items-center gap-2 text-sm text-[var(--pixel-gray-400)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyChanged}
                  onChange={(e) => setShowOnlyChanged(e.target.checked)}
                  className="accent-[var(--pixel-blue-sky)]"
                  data-testid="changed-only-checkbox"
                />
                Only changed
              </label>
            </div>
          )}

          {/* Results Count */}
          {watchlist.length > 0 && (
            <div className="mb-4 text-sm text-[var(--pixel-gray-500)]">
              {filteredWatchlist.length === watchlist.length
                ? `${watchlist.length} agent${watchlist.length === 1 ? '' : 's'} watched`
                : `${filteredWatchlist.length} of ${watchlist.length} agents`}
            </div>
          )}

          {/* Empty State */}
          {watchlist.length === 0 && (
            <div className="py-16 text-center">
              <Eye
                size={48}
                className="mx-auto mb-4 text-[var(--pixel-gray-600)]"
                aria-hidden="true"
              />
              <h2 className="text-lg text-[var(--pixel-gray-300)] mb-2">No agents watched</h2>
              <p className="text-[var(--pixel-gray-500)] mb-6">
                Add agents to your watchlist to monitor reputation and status changes.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[var(--pixel-blue-text)] text-[var(--pixel-blue-text)] hover:bg-[var(--pixel-blue-text)] hover:text-[var(--pixel-black)] transition-colors"
              >
                Explore agents
              </Link>
            </div>
          )}

          {/* No Results */}
          {watchlist.length > 0 && filteredWatchlist.length === 0 && (
            <div className="py-16 text-center">
              <Search
                size={48}
                className="mx-auto mb-4 text-[var(--pixel-gray-600)]"
                aria-hidden="true"
              />
              <h2 className="text-lg text-[var(--pixel-gray-300)] mb-2">No matching agents</h2>
              <p className="text-[var(--pixel-gray-500)]">Try adjusting your filters.</p>
            </div>
          )}

          {/* Watchlist Panel */}
          {filteredWatchlist.length > 0 && (
            <WatchlistPanel
              watchlist={filteredWatchlist}
              onRemove={removeFromWatchlist}
              onUpdateNotes={setAgentNotes}
              onClearAll={clearWatchlist}
              maxAgents={50}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
