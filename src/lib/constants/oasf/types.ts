/**
 * OASF (Open Agentic Schema Framework) taxonomy type definitions
 */

/**
 * A category in the OASF taxonomy (skill or domain)
 */
export interface TaxonomyCategory {
  /** Numeric ID from OASF schema */
  id: number;
  /** URL-safe slug (e.g., "natural_language_processing") */
  slug: string;
  /** Human-readable name (e.g., "Natural Language Processing") */
  name: string;
  /** Optional description of the category */
  description?: string;
  /** Parent category ID (undefined for top-level) */
  parentId?: number;
  /** Child categories */
  children?: TaxonomyCategory[];
}

/**
 * Resolved taxonomy item with full path information
 */
export interface ResolvedTaxonomyItem {
  /** The original slug */
  slug: string;
  /** Human-readable name */
  name: string;
  /** Parent category name (if any) */
  parentName?: string;
  /** Full hierarchical path (e.g., "Natural Language Processing > Summarization") */
  fullPath: string;
  /** The category object */
  category: TaxonomyCategory;
  /** The parent category object (if any) */
  parent?: TaxonomyCategory;
}

/**
 * The complete taxonomy tree
 */
export interface TaxonomyTree {
  /** OASF version */
  version: string;
  /** Root categories */
  categories: TaxonomyCategory[];
}

/**
 * Type of taxonomy
 */
export type TaxonomyType = 'skill' | 'domain';
