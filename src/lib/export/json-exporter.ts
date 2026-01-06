/**
 * JSON Exporter Utility
 *
 * Provides flexible JSON export functionality for various data types.
 */

/**
 * Options for JSON export
 */
export interface JsonExportOptions {
  /** Whether to pretty-print the JSON output */
  prettyPrint?: boolean;
  /** Number of spaces for indentation when pretty-printing (default: 2) */
  indent?: number;
  /** Fields to include. If not provided, all fields are included */
  fields?: string[];
  /** Fields to exclude from export */
  excludeFields?: string[];
  /** Wrapper key for the data (e.g., 'agents' wraps as { agents: [...] }) */
  wrapperKey?: string;
  /** Additional metadata to include in the export */
  metadata?: Record<string, unknown>;
}

const DEFAULT_OPTIONS: Required<Omit<JsonExportOptions, 'wrapperKey' | 'metadata'>> & {
  wrapperKey: string | undefined;
  metadata: Record<string, unknown> | undefined;
} = {
  prettyPrint: true,
  indent: 2,
  fields: [],
  excludeFields: [],
  wrapperKey: undefined,
  metadata: undefined,
};

/**
 * Filters an object to only include specified fields
 */
function filterFields<T extends Record<string, unknown>>(
  item: T,
  fields: string[],
  excludeFields: string[],
): Partial<T> {
  // If no fields specified and no excludes, return full object
  if (fields.length === 0 && excludeFields.length === 0) {
    return item;
  }

  const result: Partial<T> = {};
  const keysToInclude =
    fields.length > 0 ? fields : Object.keys(item).filter((key) => !excludeFields.includes(key));

  for (const key of keysToInclude) {
    if (key in item && !excludeFields.includes(key)) {
      result[key as keyof T] = item[key as keyof T];
    }
  }

  return result;
}

/**
 * Converts an array of objects to JSON format
 *
 * @example
 * ```ts
 * const agents = [
 *   { id: '1', name: 'Agent A', chainId: 11155111 },
 *   { id: '2', name: 'Agent B', chainId: 84532 },
 * ];
 *
 * const json = toJson(agents, {
 *   wrapperKey: 'agents',
 *   metadata: { exportedAt: Date.now() }
 * });
 * ```
 */
export function toJson<T extends Record<string, unknown>>(
  data: T[],
  options: JsonExportOptions = {},
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Filter fields from each item
  const processedData = data.map((item) => filterFields(item, opts.fields, opts.excludeFields));

  // Build output structure
  let output: unknown;

  if (opts.wrapperKey || opts.metadata) {
    const wrapped: Record<string, unknown> = {};

    if (opts.metadata) {
      Object.assign(wrapped, opts.metadata);
    }

    if (opts.wrapperKey) {
      wrapped[opts.wrapperKey] = processedData;
    } else {
      wrapped.data = processedData;
    }

    output = wrapped;
  } else {
    output = processedData;
  }

  // Stringify with optional pretty-printing
  if (opts.prettyPrint) {
    return JSON.stringify(output, null, opts.indent);
  }

  return JSON.stringify(output);
}

/**
 * Downloads data as a JSON file in the browser
 *
 * @example
 * ```ts
 * downloadJson(agents, 'agents-export.json', {
 *   wrapperKey: 'agents',
 *   prettyPrint: true
 * });
 * ```
 */
export function downloadJson<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  options: JsonExportOptions = {},
): void {
  const json = toJson(data, options);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.json') ? filename : `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Preset export configurations for common data types
 */
export const JSON_PRESETS = {
  /** Export configuration for bookmarked agents */
  bookmarks: {
    wrapperKey: 'bookmarks',
    metadata: {
      version: '1.0',
      type: 'agent-explorer-bookmarks',
    },
  } satisfies JsonExportOptions,

  /** Export configuration for agent search results */
  agents: {
    wrapperKey: 'agents',
    excludeFields: ['matchReasons', 'relevanceScore'],
    metadata: {
      version: '1.0',
      type: 'agent-explorer-agents',
    },
  } satisfies JsonExportOptions,

  /** Export configuration for full agent details */
  agentDetails: {
    wrapperKey: 'agent',
    metadata: {
      version: '1.0',
      type: 'agent-explorer-agent-detail',
    },
  } satisfies JsonExportOptions,

  /** Minimal export without wrapper or metadata */
  minimal: {
    prettyPrint: false,
    wrapperKey: undefined,
    metadata: undefined,
  } satisfies JsonExportOptions,
} as const;

/**
 * Creates an export-ready structure with metadata
 *
 * @example
 * ```ts
 * const exportData = createExportStructure(agents, {
 *   type: 'bookmarks',
 *   exportedBy: 'user@example.com'
 * });
 * ```
 */
export function createExportStructure<T extends Record<string, unknown>>(
  data: T[],
  meta: {
    type: string;
    version?: string;
    [key: string]: unknown;
  },
): {
  meta: typeof meta & { exportedAt: string; count: number };
  data: T[];
} {
  return {
    meta: {
      version: '1.0',
      ...meta,
      exportedAt: new Date().toISOString(),
      count: data.length,
    },
    data,
  };
}
