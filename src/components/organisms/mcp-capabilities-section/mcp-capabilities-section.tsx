'use client';

import {
  AlertCircle,
  BookText,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Wrench,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { cn, formatDateTimeSafe } from '@/lib/utils';
import type { McpCapabilities, McpPrompt, McpResource, McpTool } from '@/types/agent';

export interface McpCapabilitiesSectionProps {
  /** MCP capabilities data */
  capabilities?: McpCapabilities;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Optional additional class names */
  className?: string;
}

interface ExpandableCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  badge?: string;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
}

function ExpandableCard({
  title,
  description,
  icon,
  badge,
  children,
  defaultExpanded = false,
}: ExpandableCardProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasExpandableContent = Boolean(children);

  return (
    <div
      className={cn(
        'border border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-900)]',
        hasExpandableContent && 'cursor-pointer',
      )}
      data-testid="mcp-expandable-card"
    >
      <button
        type="button"
        className={cn(
          'w-full flex items-start gap-3 p-3 text-left',
          hasExpandableContent && 'hover:bg-[var(--pixel-gray-800)] transition-colors',
        )}
        onClick={() => hasExpandableContent && setIsExpanded(!isExpanded)}
        disabled={!hasExpandableContent}
        aria-expanded={hasExpandableContent ? isExpanded : undefined}
      >
        <div className="text-[var(--pixel-blue-text)] shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-[var(--pixel-gray-100)] truncate">{title}</span>
            {badge && (
              <span className="px-1.5 py-0.5 text-[0.6rem] bg-[var(--pixel-gray-700)] text-[var(--pixel-gray-400)] rounded-sm uppercase">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-[var(--pixel-gray-400)] mt-1 line-clamp-2">{description}</p>
          )}
        </div>
        {hasExpandableContent && (
          <div className="shrink-0 text-[var(--pixel-gray-500)]">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        )}
      </button>

      {isExpanded && children && (
        <div className="px-3 pb-3 pt-0 border-t border-[var(--pixel-gray-700)]">{children}</div>
      )}
    </div>
  );
}

interface ToolCardProps {
  tool: McpTool;
}

function ToolCard({ tool }: ToolCardProps): React.JSX.Element {
  const hasSchema =
    tool.inputSchema && Object.keys(tool.inputSchema as Record<string, unknown>).length > 0;

  return (
    <ExpandableCard
      title={tool.name}
      description={tool.description}
      icon={<Wrench size={16} />}
      defaultExpanded={false}
    >
      {hasSchema && (
        <div className="mt-3">
          <p className="text-[0.625rem] text-[var(--pixel-gray-500)] uppercase tracking-wide mb-2">
            Input Schema
          </p>
          <pre className="p-2 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)] overflow-x-auto text-[0.7rem] text-[var(--pixel-gray-300)] font-mono max-h-48 overflow-y-auto">
            {JSON.stringify(tool.inputSchema, null, 2)}
          </pre>
        </div>
      )}
    </ExpandableCard>
  );
}

interface PromptCardProps {
  prompt: McpPrompt;
}

function PromptCard({ prompt }: PromptCardProps): React.JSX.Element {
  const hasArguments = prompt.arguments && prompt.arguments.length > 0;

  return (
    <ExpandableCard
      title={prompt.name}
      description={prompt.description}
      icon={<BookText size={16} />}
      defaultExpanded={false}
    >
      {hasArguments && (
        <div className="mt-3">
          <p className="text-[0.625rem] text-[var(--pixel-gray-500)] uppercase tracking-wide mb-2">
            Arguments
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[var(--pixel-gray-500)] border-b border-[var(--pixel-gray-700)]">
                <th className="pb-1 font-normal">Name</th>
                <th className="pb-1 font-normal">Required</th>
                <th className="pb-1 font-normal">Description</th>
              </tr>
            </thead>
            <tbody>
              {prompt.arguments?.map((arg) => (
                <tr
                  key={arg.name}
                  className="border-b border-[var(--pixel-gray-700)] last:border-0"
                >
                  <td className="py-1.5 font-mono text-[var(--pixel-gray-200)]">{arg.name}</td>
                  <td className="py-1.5">
                    {arg.required ? (
                      <span className="text-[var(--pixel-gold-coin)]">Yes</span>
                    ) : (
                      <span className="text-[var(--pixel-gray-500)]">No</span>
                    )}
                  </td>
                  <td className="py-1.5 text-[var(--pixel-gray-400)]">{arg.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ExpandableCard>
  );
}

interface ResourceCardProps {
  resource: McpResource;
}

function ResourceCard({ resource }: ResourceCardProps): React.JSX.Element {
  return (
    <ExpandableCard
      title={resource.name}
      description={resource.description}
      icon={<FileText size={16} />}
      badge={resource.mimeType}
      defaultExpanded={false}
    >
      <div className="mt-3">
        <p className="text-[0.625rem] text-[var(--pixel-gray-500)] uppercase tracking-wide mb-1">
          URI
        </p>
        <code className="text-xs font-mono text-[var(--pixel-gray-300)] break-all">
          {resource.uri}
        </code>
      </div>
    </ExpandableCard>
  );
}

interface CollapsibleListProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

function CollapsibleList({
  title,
  icon,
  count,
  children,
  defaultExpanded = true,
}: CollapsibleListProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div data-testid={`mcp-list-${title.toLowerCase()}`}>
      <button
        type="button"
        className={cn(
          'w-full flex items-center gap-2 py-2',
          'text-left hover:text-[var(--pixel-gray-100)] transition-colors',
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <ChevronDown
          size={14}
          className={cn(
            'transition-transform duration-100 text-[var(--pixel-gray-500)]',
            !isExpanded && '-rotate-90',
          )}
          style={{ transitionTimingFunction: 'steps(2)' }}
        />
        <span className="text-[var(--pixel-blue-text)]">{icon}</span>
        <span className="font-[family-name:var(--font-pixel-body)] text-xs uppercase text-[var(--pixel-gray-200)]">
          {title}
        </span>
        <span className="text-[var(--pixel-gray-500)] text-xs ml-auto">({count})</span>
      </button>

      {isExpanded && <div className="space-y-2 pb-2">{children}</div>}
    </div>
  );
}

/**
 * McpCapabilitiesSection displays detailed MCP capabilities for an agent.
 * Shows tools, prompts, and resources with expandable cards.
 *
 * @example
 * ```tsx
 * <McpCapabilitiesSection
 *   capabilities={agent.mcpCapabilities}
 *   isLoading={false}
 * />
 * ```
 */
export function McpCapabilitiesSection({
  capabilities,
  isLoading = false,
  className,
}: McpCapabilitiesSectionProps): React.JSX.Element | null {
  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          'p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] space-y-4',
          className,
        )}
        data-testid="mcp-capabilities-loading"
      >
        <div className="h-6 w-48 bg-[var(--pixel-gray-700)] animate-pulse rounded-sm" />
        <div className="space-y-2">
          <div className="h-16 bg-[var(--pixel-gray-700)] animate-pulse rounded-sm" />
          <div className="h-16 bg-[var(--pixel-gray-700)] animate-pulse rounded-sm" />
          <div className="h-16 bg-[var(--pixel-gray-700)] animate-pulse rounded-sm" />
        </div>
      </div>
    );
  }

  // No capabilities
  if (!capabilities) {
    return null;
  }

  // Error state
  if (capabilities.error) {
    return (
      <div
        className={cn(
          'p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]',
          className,
        )}
        data-testid="mcp-capabilities-error"
      >
        <h2 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] mb-4">
          MCP CAPABILITIES
        </h2>
        <div className="flex items-start gap-3 p-3 bg-[var(--pixel-red-fire)]/10 border border-[var(--pixel-red-fire)]/30">
          <AlertCircle size={18} className="text-[var(--pixel-red-fire)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[var(--pixel-red-fire)] font-[family-name:var(--font-pixel-body)]">
              Failed to fetch capabilities
            </p>
            <p className="text-xs text-[var(--pixel-gray-400)] mt-1">{capabilities.error}</p>
          </div>
        </div>
      </div>
    );
  }

  const hasTools = capabilities.tools.length > 0;
  const hasPrompts = capabilities.prompts.length > 0;
  const hasResources = capabilities.resources.length > 0;
  const hasData = hasTools || hasPrompts || hasResources;

  // No data (but no error)
  if (!hasData) {
    return (
      <div
        className={cn(
          'p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]',
          className,
        )}
        data-testid="mcp-capabilities-empty"
      >
        <h2 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] mb-4">
          MCP CAPABILITIES
        </h2>
        <p className="text-sm text-[var(--pixel-gray-500)]">
          No MCP capabilities discovered for this agent.
        </p>
        {capabilities.fetchedAt && (
          <p className="text-xs text-[var(--pixel-gray-600)] mt-2 flex items-center gap-1">
            <Clock size={12} />
            Last checked: {formatDateTimeSafe(capabilities.fetchedAt) ?? 'Unknown'}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]',
        className,
      )}
      data-testid="mcp-capabilities-section"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)]">
          MCP CAPABILITIES
        </h2>
        {capabilities.fetchedAt && (
          <span
            className="text-[0.625rem] text-[var(--pixel-gray-500)] flex items-center gap-1"
            title={`Last fetched: ${capabilities.fetchedAt}`}
          >
            <Clock size={10} />
            {formatDateTimeSafe(capabilities.fetchedAt) ?? 'Unknown'}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Tools */}
        {hasTools && (
          <CollapsibleList
            title="Tools"
            icon={<Wrench size={14} />}
            count={capabilities.tools.length}
            defaultExpanded={true}
          >
            {capabilities.tools.map((tool) => (
              <ToolCard key={tool.name} tool={tool} />
            ))}
          </CollapsibleList>
        )}

        {/* Prompts */}
        {hasPrompts && (
          <CollapsibleList
            title="Prompts"
            icon={<BookText size={14} />}
            count={capabilities.prompts.length}
            defaultExpanded={true}
          >
            {capabilities.prompts.map((prompt) => (
              <PromptCard key={prompt.name} prompt={prompt} />
            ))}
          </CollapsibleList>
        )}

        {/* Resources */}
        {hasResources && (
          <CollapsibleList
            title="Resources"
            icon={<FileText size={14} />}
            count={capabilities.resources.length}
            defaultExpanded={true}
          >
            {capabilities.resources.map((resource) => (
              <ResourceCard key={resource.uri} resource={resource} />
            ))}
          </CollapsibleList>
        )}
      </div>
    </div>
  );
}
