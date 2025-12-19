import { Globe, Server, Webhook } from 'lucide-react';
import type React from 'react';
import { CopyButton } from '@/components/atoms';
import { cn } from '@/lib/utils';

export type EndpointType = 'http' | 'websocket' | 'webhook';

export interface EndpointItemProps {
  /** The endpoint URL */
  url: string;
  /** Type of endpoint */
  type?: EndpointType;
  /** Optional label for the endpoint */
  label?: string;
  /** Whether to show the copy button */
  showCopy?: boolean;
  /** Whether to truncate long URLs */
  truncate?: boolean;
  /** Optional additional class names */
  className?: string;
}

const ENDPOINT_ICONS: Record<EndpointType, React.ElementType> = {
  http: Globe,
  websocket: Server,
  webhook: Webhook,
};

const ENDPOINT_LABELS: Record<EndpointType, string> = {
  http: 'HTTP',
  websocket: 'WS',
  webhook: 'HOOK',
};

/**
 * EndpointItem displays an endpoint URL with type icon and optional copy functionality.
 *
 * @example
 * ```tsx
 * <EndpointItem url="https://api.example.com/agent" type="http" />
 * <EndpointItem url="wss://ws.example.com" type="websocket" showCopy />
 * ```
 */
export function EndpointItem({
  url,
  type = 'http',
  label,
  showCopy = true,
  truncate = true,
  className,
}: EndpointItemProps): React.JSX.Element {
  const Icon = ENDPOINT_ICONS[type];
  const typeLabel = label || ENDPOINT_LABELS[type];

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3',
        'bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]',
        className,
      )}
      data-testid="endpoint-item"
      data-type={type}
    >
      <div className="flex items-center gap-2 shrink-0">
        <Icon size={14} className="text-[var(--pixel-gray-500)]" aria-hidden="true" />
        <span className="text-[var(--pixel-gray-500)] font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase">
          {typeLabel}
        </span>
      </div>

      <span
        className={cn(
          'flex-1 font-mono text-xs text-[var(--pixel-gray-300)]',
          truncate && 'truncate',
        )}
        title={url}
        data-testid="endpoint-url"
      >
        {url}
      </span>

      {showCopy && <CopyButton text={url} size="sm" label={`Copy ${typeLabel} URL`} />}
    </div>
  );
}
