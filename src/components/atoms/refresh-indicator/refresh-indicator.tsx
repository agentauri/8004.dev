import { formatDistanceToNow } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import type React from 'react';

export interface RefreshIndicatorProps {
  isRefreshing: boolean;
  lastUpdated?: Date;
  onManualRefresh?: () => void;
  className?: string;
}

export function RefreshIndicator({
  isRefreshing,
  lastUpdated,
  onManualRefresh,
  className = '',
}: RefreshIndicatorProps): React.JSX.Element {
  const handleClick = () => {
    if (onManualRefresh && !isRefreshing) {
      onManualRefresh();
    }
  };

  const getLastUpdatedText = (): string => {
    if (!lastUpdated) {
      return 'Never updated';
    }
    return `Last updated: ${formatDistanceToNow(lastUpdated, { addSuffix: true })}`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isRefreshing}
      className={`flex items-center gap-2 font-mono text-sm transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-100 ${className}`}
      data-testid="refresh-indicator"
      aria-label={isRefreshing ? 'Refreshing...' : 'Refresh'}
    >
      <RefreshCw
        className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-[#5C94FC]' : 'text-[#5C94FC]'}`}
        aria-hidden="true"
      />
      <span className={`${isRefreshing ? 'text-[#5C94FC]' : 'text-gray-400'}`}>
        {isRefreshing ? 'Refreshing...' : getLastUpdatedText()}
      </span>
    </button>
  );
}
