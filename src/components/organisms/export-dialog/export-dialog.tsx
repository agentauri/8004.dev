'use client';

import { Download, FileJson, FileSpreadsheet, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  CSV_PRESETS,
  type CsvExportOptions,
  downloadCsv,
  downloadJson,
  JSON_PRESETS,
  type JsonExportOptions,
} from '@/lib/export';

export type ExportFormat = 'csv' | 'json';

export interface ExportDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback to close the dialog */
  onClose: () => void;
  /** Data to export */
  data: Record<string, unknown>[];
  /** Default filename (without extension) */
  filename?: string;
  /** Export preset type */
  presetType?: 'bookmarks' | 'agents' | 'agentDetails';
  /** Dialog title */
  title?: string;
}

/**
 * Dialog for exporting data in CSV or JSON format.
 * Provides format selection and download options.
 *
 * @example
 * ```tsx
 * <ExportDialog
 *   isOpen={showExport}
 *   onClose={() => setShowExport(false)}
 *   data={agents}
 *   filename="agent-export"
 *   presetType="agents"
 * />
 * ```
 */
export function ExportDialog({
  isOpen,
  onClose,
  data,
  filename = 'export',
  presetType = 'agents',
  title = 'Export Data',
}: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [prettyPrint, setPrettyPrint] = useState(true);
  const [includeHeaders, setIncludeHeaders] = useState(true);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const handleExport = useCallback(() => {
    if (data.length === 0) return;

    const timestamp = new Date().toISOString().split('T')[0];
    const exportFilename = `${filename}-${timestamp}`;

    if (format === 'csv') {
      const csvPreset =
        presetType === 'bookmarks'
          ? CSV_PRESETS.bookmarks
          : presetType === 'agentDetails'
            ? CSV_PRESETS.agentDetails
            : CSV_PRESETS.agents;

      const options: CsvExportOptions = {
        ...csvPreset,
        includeHeaders,
      };

      downloadCsv(data, exportFilename, options);
    } else {
      const jsonPreset =
        presetType === 'bookmarks'
          ? JSON_PRESETS.bookmarks
          : presetType === 'agentDetails'
            ? JSON_PRESETS.agentDetails
            : JSON_PRESETS.agents;

      const options: JsonExportOptions = {
        ...jsonPreset,
        prettyPrint,
        metadata: {
          ...jsonPreset.metadata,
          exportedAt: new Date().toISOString(),
          count: data.length,
        },
      };

      downloadJson(data, exportFilename, options);
    }

    onClose();
  }, [data, filename, format, presetType, prettyPrint, includeHeaders, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      data-testid="export-dialog-backdrop"
      role="presentation"
    >
      <div
        className="relative w-full max-w-md bg-[var(--pixel-gray-900)] border-2 border-[var(--pixel-gray-700)] shadow-[0_0_30px_rgba(92,148,252,0.3)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-dialog-title"
        data-testid="export-dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-[var(--pixel-gray-700)]">
          <h2
            id="export-dialog-title"
            className="font-[family-name:var(--font-pixel-heading)] text-lg text-[var(--pixel-blue-text)] uppercase tracking-wider"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--pixel-gray-400)] hover:text-[var(--pixel-white)] hover:bg-[var(--pixel-gray-800)] transition-colors"
            aria-label="Close dialog"
            data-testid="export-dialog-close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Data count */}
          <div className="text-sm text-[var(--pixel-gray-400)]">
            <span className="text-[var(--pixel-gold-coin)]">{data.length}</span> items to export
          </div>

          {/* Format selection */}
          <fieldset>
            <legend className="text-xs text-[var(--pixel-gray-400)] uppercase tracking-wider mb-3">
              Export Format
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <FormatButton
                format="csv"
                selected={format === 'csv'}
                onClick={() => setFormat('csv')}
                icon={<FileSpreadsheet size={24} />}
                label="CSV"
                description="Spreadsheet format"
              />
              <FormatButton
                format="json"
                selected={format === 'json'}
                onClick={() => setFormat('json')}
                icon={<FileJson size={24} />}
                label="JSON"
                description="Structured data"
              />
            </div>
          </fieldset>

          {/* Format-specific options */}
          <div className="space-y-3">
            <p className="text-xs text-[var(--pixel-gray-400)] uppercase tracking-wider">Options</p>

            {format === 'csv' && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHeaders}
                  onChange={(e) => setIncludeHeaders(e.target.checked)}
                  className="w-4 h-4 accent-[var(--pixel-blue-sky)]"
                  data-testid="include-headers-checkbox"
                />
                <span className="text-sm text-[var(--pixel-gray-200)]">Include column headers</span>
              </label>
            )}

            {format === 'json' && (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prettyPrint}
                  onChange={(e) => setPrettyPrint(e.target.checked)}
                  className="w-4 h-4 accent-[var(--pixel-blue-sky)]"
                  data-testid="pretty-print-checkbox"
                />
                <span className="text-sm text-[var(--pixel-gray-200)]">
                  Pretty print (formatted)
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t-2 border-[var(--pixel-gray-700)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-[var(--pixel-gray-400)] hover:text-[var(--pixel-white)] transition-colors"
            data-testid="export-dialog-cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={data.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border-2 border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)] hover:bg-[var(--pixel-green-pipe)] hover:text-[var(--pixel-black)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="export-dialog-download"
          >
            <Download size={16} />
            Download {format.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}

interface FormatButtonProps {
  format: ExportFormat;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}

function FormatButton({ format, selected, onClick, icon, label, description }: FormatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center gap-2 p-4 border-2 transition-all
        ${
          selected
            ? 'border-[var(--pixel-blue-sky)] bg-[var(--pixel-blue-sky)]/10 text-[var(--pixel-blue-text)]'
            : 'border-[var(--pixel-gray-700)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gray-600)]'
        }
      `}
      aria-pressed={selected}
      data-testid={`format-${format}`}
    >
      {icon}
      <span className="font-[family-name:var(--font-pixel-body)] text-sm uppercase">{label}</span>
      <span className="text-xs text-[var(--pixel-gray-500)]">{description}</span>
    </button>
  );
}
