/**
 * Bookmarks Page
 *
 * Displays all bookmarked agents with filtering, sorting, and export capabilities.
 */

'use client';

import { Bookmark, Download, Search, Trash2, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { ChainBadge, type ChainId } from '@/components/atoms';
import { MainLayout } from '@/components/templates';
import type { BookmarkedAgent } from '@/hooks';
import { useBookmarks } from '@/hooks';

type SortOption = 'recent' | 'name' | 'chain';

export default function BookmarksPage() {
  const { bookmarks, removeBookmark, clearBookmarks, exportBookmarks, importBookmarks } =
    useBookmarks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Get unique chains from bookmarks
  const uniqueChains = useMemo(() => {
    const chains = new Set(bookmarks.map((b) => b.chainId));
    return Array.from(chains).sort();
  }, [bookmarks]);

  // Filter and sort bookmarks
  const filteredBookmarks = useMemo(() => {
    let result = [...bookmarks];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.description?.toLowerCase().includes(query) ||
          b.agentId.includes(query),
      );
    }

    // Filter by chain
    if (selectedChain !== null) {
      result = result.filter((b) => b.chainId === selectedChain);
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'chain':
        result.sort((a, b) => a.chainId - b.chainId);
        break;
      default:
        // 'recent' is the default sort order
        result.sort((a, b) => b.bookmarkedAt - a.bookmarkedAt);
    }

    return result;
  }, [bookmarks, searchQuery, selectedChain, sortBy]);

  const handleExport = useCallback(() => {
    const data = exportBookmarks();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-explorer-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportBookmarks]);

  const handleImport = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setImportError(null);
      setImportSuccess(null);

      try {
        const text = await file.text();
        const result = importBookmarks(text);

        if (result.errors > 0 && result.imported === 0) {
          setImportError('Import failed. Invalid file format.');
        } else if (result.errors > 0) {
          setImportSuccess(
            `Imported ${result.imported} items. ${result.errors} items skipped (duplicates or invalid).`,
          );
        } else {
          setImportSuccess(`Successfully imported ${result.imported} items.`);
        }
      } catch {
        setImportError('Failed to read file.');
      }

      // Reset file input
      event.target.value = '';
    },
    [importBookmarks],
  );

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-pixel-grid">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Page Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Bookmark className="w-8 h-8 text-[var(--pixel-gold-coin)]" aria-hidden="true" />
                <h1 className="font-[family-name:var(--font-pixel-display)] text-2xl md:text-3xl text-[var(--pixel-gray-100)]">
                  Bookmarks
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <label
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm border-2 border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-blue-text)] hover:text-[var(--pixel-blue-text)] transition-colors cursor-pointer"
                  aria-label="Import bookmarks"
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
                  disabled={bookmarks.length === 0}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm border-2 border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-blue-text)] hover:text-[var(--pixel-blue-text)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Export bookmarks"
                >
                  <Download size={16} aria-hidden="true" />
                  Export
                </button>
              </div>
            </div>
            <p className="text-[var(--pixel-gray-400)] max-w-2xl">
              Your saved agents for quick access. Bookmarks are stored locally in your browser.
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
          {bookmarks.length > 0 && (
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
                  placeholder="Search bookmarks..."
                  className="w-full pl-10 pr-4 py-2 bg-[var(--pixel-gray-900)] border-2 border-[var(--pixel-gray-700)] text-[var(--pixel-gray-200)] placeholder-[var(--pixel-gray-500)] focus:border-[var(--pixel-blue-text)] focus:outline-none"
                  data-testid="search-input"
                />
              </div>

              {/* Chain Filter */}
              <select
                value={selectedChain ?? ''}
                onChange={(e) => setSelectedChain(e.target.value ? Number(e.target.value) : null)}
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
                <option value="name">Name A-Z</option>
                <option value="chain">By Chain</option>
              </select>

              {/* Clear All */}
              <button
                type="button"
                onClick={clearBookmarks}
                className="ml-auto inline-flex items-center gap-2 px-3 py-2 text-sm text-[var(--pixel-gray-500)] hover:text-[var(--pixel-red-fire)] transition-colors"
                aria-label="Clear all bookmarks"
              >
                <Trash2 size={16} aria-hidden="true" />
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          {bookmarks.length > 0 && (
            <div className="mb-4 text-sm text-[var(--pixel-gray-500)]">
              {filteredBookmarks.length === bookmarks.length
                ? `${bookmarks.length} bookmark${bookmarks.length === 1 ? '' : 's'}`
                : `${filteredBookmarks.length} of ${bookmarks.length} bookmarks`}
            </div>
          )}

          {/* Empty State */}
          {bookmarks.length === 0 && (
            <div className="py-16 text-center">
              <Bookmark
                size={48}
                className="mx-auto mb-4 text-[var(--pixel-gray-600)]"
                aria-hidden="true"
              />
              <h2 className="text-lg text-[var(--pixel-gray-300)] mb-2">No bookmarks yet</h2>
              <p className="text-[var(--pixel-gray-500)] mb-6">
                Save agents by clicking the bookmark icon on agent cards.
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
          {bookmarks.length > 0 && filteredBookmarks.length === 0 && (
            <div className="py-16 text-center">
              <Search
                size={48}
                className="mx-auto mb-4 text-[var(--pixel-gray-600)]"
                aria-hidden="true"
              />
              <h2 className="text-lg text-[var(--pixel-gray-300)] mb-2">No matching bookmarks</h2>
              <p className="text-[var(--pixel-gray-500)]">Try adjusting your filters.</p>
            </div>
          )}

          {/* Bookmarks List */}
          {filteredBookmarks.length > 0 && (
            <div className="grid gap-4" data-testid="bookmarks-list">
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.agentId}
                  bookmark={bookmark}
                  onRemove={removeBookmark}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

interface BookmarkCardProps {
  bookmark: BookmarkedAgent;
  onRemove: (agentId: string) => void;
  formatDate: (timestamp: number) => string;
}

function BookmarkCard({ bookmark, onRemove, formatDate }: BookmarkCardProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(bookmark.agentId);
  };

  return (
    <Link
      href={`/agent/${bookmark.agentId}`}
      className="group block p-4 bg-[var(--pixel-gray-900)] border-2 border-[var(--pixel-gray-700)] hover:border-[var(--pixel-gold-coin)] transition-colors"
      data-testid={`bookmark-card-${bookmark.agentId}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg text-[var(--pixel-white)] font-medium truncate">
              {bookmark.name}
            </h3>
            <ChainBadge chainId={bookmark.chainId as ChainId} />
          </div>
          {bookmark.description && (
            <p className="text-sm text-[var(--pixel-gray-400)] line-clamp-2 mb-2">
              {bookmark.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-[var(--pixel-gray-500)]">
            <span>ID: {bookmark.agentId}</span>
            <span>Saved {formatDate(bookmark.bookmarkedAt)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="p-2 text-[var(--pixel-gray-500)] hover:text-[var(--pixel-red-fire)] opacity-0 group-hover:opacity-100 transition-all"
          aria-label={`Remove ${bookmark.name} from bookmarks`}
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>
    </Link>
  );
}
