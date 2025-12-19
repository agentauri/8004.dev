import { ExternalLink, Github } from 'lucide-react';
import type React from 'react';
import { PixelExplorer } from '@/components/atoms';
import { cn } from '@/lib/utils';

export interface FooterProps {
  /** Optional additional class names */
  className?: string;
}

/**
 * Footer displays the site footer with links and copyright.
 *
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export function Footer({ className }: FooterProps): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'px-6 py-8',
        'bg-[var(--pixel-gray-900)] border-t-2 border-[var(--pixel-gray-700)]',
        className,
      )}
      data-testid="footer"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <a
            href="https://eips.ethereum.org/EIPS/eip-8004"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-2',
              'font-[family-name:var(--font-pixel-body)] text-xs uppercase',
              'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-100)] transition-colors',
            )}
            data-testid="footer-eip-link"
          >
            ERC-8004
            <ExternalLink size={12} aria-hidden="true" />
          </a>
          <a
            href="https://github.com/agntcy"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-2',
              'font-[family-name:var(--font-pixel-body)] text-xs uppercase',
              'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-100)] transition-colors',
            )}
            data-testid="footer-github-link"
          >
            <Github size={14} aria-hidden="true" />
            GitHub
          </a>
        </div>

        <div className="flex items-center gap-3">
          <PixelExplorer size="sm" animation="float" />
          <p
            className="font-[family-name:var(--font-pixel-body)] text-[0.625rem] text-[var(--pixel-gray-500)] uppercase tracking-wider"
            data-testid="footer-copyright"
          >
            {currentYear} 8004.dev - Agent Explorer
          </p>
        </div>
      </div>
    </footer>
  );
}
