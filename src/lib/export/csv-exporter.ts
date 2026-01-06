/**
 * CSV Exporter Utility
 *
 * Provides flexible CSV export functionality for various data types.
 */

/**
 * Options for CSV export
 */
export interface CsvExportOptions {
  /** Column headers to include. If not provided, all keys from first row are used */
  columns?: string[];
  /** Custom column labels (key = field name, value = display label) */
  columnLabels?: Record<string, string>;
  /** Whether to include headers row */
  includeHeaders?: boolean;
  /** Delimiter character (default: ',') */
  delimiter?: string;
  /** How to handle array values (default: 'join') */
  arrayHandling?: 'join' | 'first' | 'count';
  /** Separator for joined arrays (default: '; ') */
  arraySeparator?: string;
}

const DEFAULT_OPTIONS: Required<CsvExportOptions> = {
  columns: [],
  columnLabels: {},
  includeHeaders: true,
  delimiter: ',',
  arrayHandling: 'join',
  arraySeparator: '; ',
};

/**
 * Escapes a value for CSV format
 * - Wraps in quotes if contains delimiter, newline, or quote
 * - Doubles any existing quotes
 */
function escapeValue(value: unknown, delimiter: string): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // Check if escaping is needed
  const needsEscaping =
    stringValue.includes(delimiter) ||
    stringValue.includes('\n') ||
    stringValue.includes('\r') ||
    stringValue.includes('"');

  if (needsEscaping) {
    // Double any existing quotes and wrap in quotes
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Converts an array value to a string based on handling option
 */
function handleArrayValue(
  value: unknown[],
  handling: CsvExportOptions['arrayHandling'],
  separator: string,
): string {
  switch (handling) {
    case 'first':
      return value.length > 0 ? String(value[0]) : '';
    case 'count':
      return String(value.length);
    default:
      // 'join' is the default array handling
      return value.join(separator);
  }
}

/**
 * Gets a nested value from an object using dot notation
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

/**
 * Converts a value to CSV-safe string
 */
function valueToString(value: unknown, options: Required<CsvExportOptions>): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (Array.isArray(value)) {
    return handleArrayValue(value, options.arrayHandling, options.arraySeparator);
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return String(value);
}

/**
 * Converts an array of objects to CSV format
 *
 * @example
 * ```ts
 * const agents = [
 *   { id: '1', name: 'Agent A', chainId: 11155111 },
 *   { id: '2', name: 'Agent B', chainId: 84532 },
 * ];
 *
 * const csv = toCsv(agents, {
 *   columns: ['id', 'name', 'chainId'],
 *   columnLabels: { id: 'Agent ID', name: 'Name', chainId: 'Chain' }
 * });
 * ```
 */
export function toCsv<T extends Record<string, unknown>>(
  data: T[],
  options: CsvExportOptions = {},
): string {
  if (data.length === 0) {
    return '';
  }

  const opts: Required<CsvExportOptions> = { ...DEFAULT_OPTIONS, ...options };

  // Determine columns from options or first row
  const columns = opts.columns.length > 0 ? opts.columns : Object.keys(data[0]);

  const rows: string[] = [];

  // Add headers row
  if (opts.includeHeaders) {
    const headerRow = columns
      .map((col) => escapeValue(opts.columnLabels[col] || col, opts.delimiter))
      .join(opts.delimiter);
    rows.push(headerRow);
  }

  // Add data rows
  for (const item of data) {
    const rowValues = columns.map((col) => {
      const value = getNestedValue(item, col);
      const stringValue = valueToString(value, opts);
      return escapeValue(stringValue, opts.delimiter);
    });
    rows.push(rowValues.join(opts.delimiter));
  }

  return rows.join('\n');
}

/**
 * Downloads data as a CSV file in the browser
 *
 * @example
 * ```ts
 * downloadCsv(agents, 'agents-export.csv', {
 *   columns: ['id', 'name'],
 *   columnLabels: { id: 'Agent ID' }
 * });
 * ```
 */
export function downloadCsv<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  options: CsvExportOptions = {},
): void {
  const csv = toCsv(data, options);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Preset export configurations for common data types
 */
export const CSV_PRESETS = {
  /** Export configuration for bookmarked agents */
  bookmarks: {
    columns: ['agentId', 'name', 'chainId', 'description', 'bookmarkedAt'],
    columnLabels: {
      agentId: 'Agent ID',
      name: 'Name',
      chainId: 'Chain ID',
      description: 'Description',
      bookmarkedAt: 'Bookmarked At',
    },
  } satisfies CsvExportOptions,

  /** Export configuration for agent search results */
  agents: {
    columns: [
      'id',
      'name',
      'description',
      'chainId',
      'isActive',
      'isVerified',
      'trustScore',
      'capabilities',
    ],
    columnLabels: {
      id: 'Agent ID',
      name: 'Name',
      description: 'Description',
      chainId: 'Chain ID',
      isActive: 'Active',
      isVerified: 'Verified',
      trustScore: 'Trust Score',
      capabilities: 'Capabilities',
    },
  } satisfies CsvExportOptions,

  /** Export configuration for agent details */
  agentDetails: {
    columns: [
      'id',
      'name',
      'description',
      'chainId',
      'isActive',
      'isVerified',
      'trustScore',
      'capabilities',
      'walletAddress',
      'supportedTrust',
      'oasfSkills',
      'oasfDomains',
    ],
    columnLabels: {
      id: 'Agent ID',
      name: 'Name',
      description: 'Description',
      chainId: 'Chain ID',
      isActive: 'Active',
      isVerified: 'Verified',
      trustScore: 'Trust Score',
      capabilities: 'Capabilities',
      walletAddress: 'Wallet Address',
      supportedTrust: 'Supported Trust',
      oasfSkills: 'OASF Skills',
      oasfDomains: 'OASF Domains',
    },
  } satisfies CsvExportOptions,
} as const;
