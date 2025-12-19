/**
 * OASF (Open Agentic Schema Framework) taxonomy utilities
 */

export { DOMAINS_BY_ID, DOMAINS_BY_SLUG, DOMAINS_TAXONOMY } from './domains';
export { SKILLS_BY_ID, SKILLS_BY_SLUG, SKILLS_TAXONOMY } from './skills';
export * from './types';

import { DOMAINS_BY_SLUG, DOMAINS_TAXONOMY } from './domains';
import { SKILLS_BY_SLUG, SKILLS_TAXONOMY } from './skills';
import type { ResolvedTaxonomyItem, TaxonomyCategory, TaxonomyType } from './types';

/**
 * Find a parent category by child's parentId
 */
function findParentCategory(
  categories: TaxonomyCategory[],
  parentId: number,
): TaxonomyCategory | undefined {
  for (const category of categories) {
    if (category.id === parentId) {
      return category;
    }
  }
  return undefined;
}

/**
 * Resolve a skill slug to its full taxonomy information
 * @param slug - The skill slug (e.g., "natural_language_processing/summarization")
 * @returns Resolved item with full path, or null if not found
 */
export function resolveSkillSlug(slug: string): ResolvedTaxonomyItem | null {
  const normalizedSlug = slug.toLowerCase().trim();
  const category = SKILLS_BY_SLUG.get(normalizedSlug);

  if (!category) {
    return null;
  }

  let parent: TaxonomyCategory | undefined;
  let parentName: string | undefined;
  let fullPath = category.name;

  if (category.parentId) {
    parent = findParentCategory(SKILLS_TAXONOMY.categories, category.parentId);
    if (parent) {
      parentName = parent.name;
      fullPath = `${parent.name} > ${category.name}`;
    }
  }

  return {
    slug: normalizedSlug,
    name: category.name,
    parentName,
    fullPath,
    category,
    parent,
  };
}

/**
 * Resolve a domain slug to its full taxonomy information
 * @param slug - The domain slug (e.g., "technology/blockchain")
 * @returns Resolved item with full path, or null if not found
 */
export function resolveDomainSlug(slug: string): ResolvedTaxonomyItem | null {
  const normalizedSlug = slug.toLowerCase().trim();
  const category = DOMAINS_BY_SLUG.get(normalizedSlug);

  if (!category) {
    return null;
  }

  let parent: TaxonomyCategory | undefined;
  let parentName: string | undefined;
  let fullPath = category.name;

  if (category.parentId) {
    parent = findParentCategory(DOMAINS_TAXONOMY.categories, category.parentId);
    if (parent) {
      parentName = parent.name;
      fullPath = `${parent.name} > ${category.name}`;
    }
  }

  return {
    slug: normalizedSlug,
    name: category.name,
    parentName,
    fullPath,
    category,
    parent,
  };
}

/**
 * Resolve a slug of either type
 * @param slug - The taxonomy slug
 * @param type - Whether it's a skill or domain
 * @returns Resolved item or null
 */
export function resolveSlug(slug: string, type: TaxonomyType): ResolvedTaxonomyItem | null {
  return type === 'skill' ? resolveSkillSlug(slug) : resolveDomainSlug(slug);
}

/**
 * Get the complete skills taxonomy tree
 */
export function getSkillTree(): TaxonomyCategory[] {
  return SKILLS_TAXONOMY.categories;
}

/**
 * Get the complete domains taxonomy tree
 */
export function getDomainTree(): TaxonomyCategory[] {
  return DOMAINS_TAXONOMY.categories;
}

/**
 * Get taxonomy tree by type
 */
export function getTaxonomyTree(type: TaxonomyType): TaxonomyCategory[] {
  return type === 'skill' ? getSkillTree() : getDomainTree();
}

/**
 * Search taxonomy categories by query string
 * @param query - Search query
 * @param type - Whether to search skills or domains
 * @returns Matching categories (flattened, includes children)
 */
export function searchTaxonomy(query: string, type: TaxonomyType): TaxonomyCategory[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) {
    return [];
  }

  const results: TaxonomyCategory[] = [];
  const categories = type === 'skill' ? SKILLS_TAXONOMY.categories : DOMAINS_TAXONOMY.categories;

  function searchInCategories(cats: TaxonomyCategory[]) {
    for (const category of cats) {
      const nameMatch = category.name.toLowerCase().includes(normalizedQuery);
      const slugMatch = category.slug.toLowerCase().includes(normalizedQuery);

      if (nameMatch || slugMatch) {
        results.push(category);
      }

      if (category.children) {
        searchInCategories(category.children);
      }
    }
  }

  searchInCategories(categories);
  return results;
}

/**
 * Get all child slugs for a parent category (including the parent itself)
 * Useful for filter logic where selecting a parent should match all children
 */
export function getChildSlugs(parentSlug: string, type: TaxonomyType): string[] {
  const slugMap = type === 'skill' ? SKILLS_BY_SLUG : DOMAINS_BY_SLUG;
  const slugs: string[] = [];

  for (const [slug] of slugMap) {
    if (slug === parentSlug || slug.startsWith(`${parentSlug}/`)) {
      slugs.push(slug);
    }
  }

  return slugs;
}

/**
 * Check if a slug matches any of the selected slugs (including parent-child relationships)
 * @param slug - The slug to check
 * @param selectedSlugs - Array of selected filter slugs
 * @param type - Taxonomy type
 * @returns true if the slug matches any selection
 */
export function slugMatchesSelection(
  slug: string,
  selectedSlugs: string[],
  _type: TaxonomyType,
): boolean {
  const normalizedSlug = slug.toLowerCase().trim();

  for (const selected of selectedSlugs) {
    const normalizedSelected = selected.toLowerCase().trim();

    // Direct match
    if (normalizedSlug === normalizedSelected) {
      return true;
    }

    // Check if selected is a parent of the slug
    if (normalizedSlug.startsWith(`${normalizedSelected}/`)) {
      return true;
    }

    // Check if slug is a parent of selected
    if (normalizedSelected.startsWith(`${normalizedSlug}/`)) {
      return true;
    }
  }

  return false;
}

/**
 * Get OASF version
 */
export function getOASFVersion(): string {
  return SKILLS_TAXONOMY.version;
}
