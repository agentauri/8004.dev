'use client';

import { CopyButton } from '@/components/atoms';

export interface CodeBlockProps {
  /** Code content to display */
  code: string;
  /** Language for syntax indication (visual only) */
  language?: 'bash' | 'json' | 'text';
  /** Optional label above the code block */
  label?: string;
  /** Whether to show the copy button */
  showCopy?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable code block component with copy functionality.
 * Displays code snippets with monospace font and retro styling.
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   code="npm install package"
 *   language="bash"
 *   label="Installation"
 * />
 * ```
 */
export function CodeBlock({
  code,
  language = 'text',
  label,
  showCopy = true,
  className = '',
}: CodeBlockProps) {
  const languageLabel = {
    bash: 'BASH',
    json: 'JSON',
    text: 'TEXT',
  }[language];

  return (
    <div className={`space-y-2 ${className}`} data-testid="code-block">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-pixel-body text-xs text-[var(--pixel-gray-400)] uppercase tracking-wider">
            {label}
          </span>
          <span className="text-pixel-body text-xs text-[var(--pixel-gray-500)]">
            {languageLabel}
          </span>
        </div>
      )}
      <div className="relative group">
        <pre
          className="bg-[var(--pixel-black)] border-2 border-[var(--pixel-gray-700)] p-4 overflow-x-auto"
          data-testid="code-block-pre"
        >
          <code
            className="text-sm font-mono text-[var(--pixel-gray-200)] whitespace-pre-wrap break-all"
            data-language={language}
          >
            {code}
          </code>
        </pre>
        {showCopy && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={code} />
          </div>
        )}
      </div>
    </div>
  );
}
