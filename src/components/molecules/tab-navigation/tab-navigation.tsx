'use client';

import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Tab item definition
 */
export interface TabItem {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Optional count to display next to label (e.g., "Feedbacks (6)") */
  count?: number;
  /** Whether the tab is disabled */
  disabled?: boolean;
}

export interface TabNavigationProps {
  /** List of tabs to display */
  tabs: TabItem[];
  /** Currently active tab ID */
  activeTab: string;
  /** Callback when tab is changed */
  onTabChange: (tabId: string) => void;
  /** Optional additional class names */
  className?: string;
}

/**
 * TabNavigation provides a horizontal tab bar for navigating between content sections.
 *
 * Features:
 * - Pixel art 80s retro styling
 * - Keyboard navigation (arrow keys)
 * - Mobile responsive with horizontal scroll
 * - Optional count badges on tabs
 * - Disabled tab support
 *
 * @example
 * ```tsx
 * <TabNavigation
 *   tabs={[
 *     { id: 'overview', label: 'Overview' },
 *     { id: 'feedbacks', label: 'Feedbacks', count: 6 },
 *     { id: 'validations', label: 'Validations', count: 0 },
 *   ]}
 *   activeTab="overview"
 *   onTabChange={(tabId) => setActiveTab(tabId)}
 * />
 * ```
 */
export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className,
}: TabNavigationProps): React.JSX.Element {
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Scroll active tab into view on mobile
  useEffect(() => {
    const activeButton = tabRefs.current.get(activeTab);
    if (activeButton && tabsRef.current) {
      const container = tabsRef.current;
      const scrollLeft = activeButton.offsetLeft - container.offsetWidth / 2 + activeButton.offsetWidth / 2;
      // Check if scrollTo is available (not in JSDOM test environment)
      if (typeof container.scrollTo === 'function') {
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeTab]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, currentIndex: number) => {
      const enabledTabs = tabs.filter((tab) => !tab.disabled);
      const currentEnabledIndex = enabledTabs.findIndex((tab) => tab.id === tabs[currentIndex].id);

      let nextIndex: number | null = null;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          nextIndex = currentEnabledIndex > 0 ? currentEnabledIndex - 1 : enabledTabs.length - 1;
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextIndex = currentEnabledIndex < enabledTabs.length - 1 ? currentEnabledIndex + 1 : 0;
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = enabledTabs.length - 1;
          break;
      }

      if (nextIndex !== null) {
        const nextTab = enabledTabs[nextIndex];
        onTabChange(nextTab.id);
        tabRefs.current.get(nextTab.id)?.focus();
      }
    },
    [tabs, onTabChange],
  );

  return (
    <div
      ref={tabsRef}
      role="tablist"
      aria-label="Agent sections"
      className={cn(
        'flex overflow-x-auto scrollbar-hide',
        'border-b-2 border-[var(--pixel-gray-700)]',
        '-mx-2 px-2 md:mx-0 md:px-0',
        className,
      )}
      data-testid="tab-navigation"
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        const isDisabled = tab.disabled ?? false;

        return (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) {
                tabRefs.current.set(tab.id, el);
              } else {
                tabRefs.current.delete(tab.id);
              }
            }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            aria-disabled={isDisabled}
            tabIndex={isActive ? 0 : -1}
            disabled={isDisabled}
            onClick={() => !isDisabled && onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'relative px-4 py-3 whitespace-nowrap',
              'font-[family-name:var(--font-pixel-body)] text-sm uppercase tracking-wider',
              'transition-all duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pixel-blue-sky)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pixel-black)]',
              // Active state
              isActive && [
                'text-[var(--pixel-blue-sky)]',
                'after:absolute after:bottom-0 after:left-0 after:right-0',
                'after:h-[2px] after:bg-[var(--pixel-blue-sky)]',
                'after:shadow-[0_0_8px_var(--pixel-blue-sky)]',
              ],
              // Inactive state
              !isActive && !isDisabled && [
                'text-[var(--pixel-gray-400)]',
                'hover:text-[var(--pixel-gray-200)]',
                'hover:bg-[var(--pixel-gray-800)]/50',
              ],
              // Disabled state
              isDisabled && [
                'text-[var(--pixel-gray-600)]',
                'cursor-not-allowed',
                'opacity-50',
              ],
            )}
            data-testid={`tab-${tab.id}`}
            data-active={isActive}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'ml-1.5 text-xs',
                  isActive ? 'text-[var(--pixel-blue-sky)]' : 'text-[var(--pixel-gray-500)]',
                )}
                data-testid={`tab-${tab.id}-count`}
              >
                ({tab.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
