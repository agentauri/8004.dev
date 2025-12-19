import { describe, expect, it } from 'vitest';
import {
  DOMAINS_BY_ID,
  DOMAINS_BY_SLUG,
  DOMAINS_TAXONOMY,
  getChildSlugs,
  getDomainTree,
  getOASFVersion,
  getSkillTree,
  getTaxonomyTree,
  resolveDomainSlug,
  resolveSkillSlug,
  resolveSlug,
  SKILLS_BY_ID,
  SKILLS_BY_SLUG,
  SKILLS_TAXONOMY,
  searchTaxonomy,
  slugMatchesSelection,
} from './index';

describe('OASF Taxonomy', () => {
  describe('SKILLS_TAXONOMY', () => {
    it('has correct version', () => {
      expect(SKILLS_TAXONOMY.version).toBe('0.8.0');
    });

    it('has 15 top-level categories', () => {
      expect(SKILLS_TAXONOMY.categories).toHaveLength(15);
    });

    it('has Natural Language Processing as first category', () => {
      expect(SKILLS_TAXONOMY.categories[0].name).toBe('Natural Language Processing');
      expect(SKILLS_TAXONOMY.categories[0].slug).toBe('natural_language_processing');
    });

    it('has children for NLP category', () => {
      const nlp = SKILLS_TAXONOMY.categories[0];
      expect(nlp.children).toBeDefined();
      expect(nlp.children!.length).toBeGreaterThan(0);
    });
  });

  describe('DOMAINS_TAXONOMY', () => {
    it('has correct version', () => {
      expect(DOMAINS_TAXONOMY.version).toBe('0.8.0');
    });

    it('has 24 top-level categories', () => {
      expect(DOMAINS_TAXONOMY.categories).toHaveLength(24);
    });

    it('has Technology as first category', () => {
      expect(DOMAINS_TAXONOMY.categories[0].name).toBe('Technology');
      expect(DOMAINS_TAXONOMY.categories[0].slug).toBe('technology');
    });

    it('has children for Technology category', () => {
      const tech = DOMAINS_TAXONOMY.categories[0];
      expect(tech.children).toBeDefined();
      expect(tech.children!.length).toBeGreaterThan(0);
    });
  });

  describe('SKILLS_BY_SLUG', () => {
    it('contains top-level categories', () => {
      expect(SKILLS_BY_SLUG.has('natural_language_processing')).toBe(true);
      expect(SKILLS_BY_SLUG.has('images_computer_vision')).toBe(true);
    });

    it('contains child categories with composite slugs', () => {
      expect(SKILLS_BY_SLUG.has('natural_language_processing/natural_language_understanding')).toBe(
        true,
      );
      expect(SKILLS_BY_SLUG.has('images_computer_vision/image_segmentation')).toBe(true);
    });
  });

  describe('SKILLS_BY_ID', () => {
    it('contains categories by ID', () => {
      expect(SKILLS_BY_ID.has(1)).toBe(true); // NLP
      expect(SKILLS_BY_ID.has(101)).toBe(true); // NLU
    });

    it('returns correct category for ID', () => {
      const nlp = SKILLS_BY_ID.get(1);
      expect(nlp?.name).toBe('Natural Language Processing');
    });
  });

  describe('DOMAINS_BY_SLUG', () => {
    it('contains top-level categories', () => {
      expect(DOMAINS_BY_SLUG.has('technology')).toBe(true);
      expect(DOMAINS_BY_SLUG.has('healthcare')).toBe(true);
    });

    it('contains child categories with composite slugs', () => {
      expect(DOMAINS_BY_SLUG.has('technology/blockchain')).toBe(true);
      expect(DOMAINS_BY_SLUG.has('healthcare/telemedicine')).toBe(true);
    });
  });

  describe('DOMAINS_BY_ID', () => {
    it('contains categories by ID', () => {
      expect(DOMAINS_BY_ID.has(1)).toBe(true); // Technology
      expect(DOMAINS_BY_ID.has(109)).toBe(true); // Blockchain
    });

    it('returns correct category for ID', () => {
      const tech = DOMAINS_BY_ID.get(1);
      expect(tech?.name).toBe('Technology');
    });
  });

  describe('resolveSkillSlug', () => {
    it('resolves top-level skill slug', () => {
      const result = resolveSkillSlug('natural_language_processing');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Natural Language Processing');
      expect(result?.fullPath).toBe('Natural Language Processing');
      expect(result?.parentName).toBeUndefined();
    });

    it('resolves child skill slug with parent info', () => {
      const result = resolveSkillSlug('natural_language_processing/natural_language_understanding');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Natural Language Understanding');
      expect(result?.parentName).toBe('Natural Language Processing');
      expect(result?.fullPath).toBe('Natural Language Processing > Natural Language Understanding');
    });

    it('returns null for unknown slug', () => {
      const result = resolveSkillSlug('unknown_skill');
      expect(result).toBeNull();
    });

    it('handles case-insensitive lookup', () => {
      const result = resolveSkillSlug('NATURAL_LANGUAGE_PROCESSING');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Natural Language Processing');
    });

    it('trims whitespace from slug', () => {
      const result = resolveSkillSlug('  natural_language_processing  ');
      expect(result).not.toBeNull();
    });
  });

  describe('resolveDomainSlug', () => {
    it('resolves top-level domain slug', () => {
      const result = resolveDomainSlug('technology');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Technology');
      expect(result?.fullPath).toBe('Technology');
      expect(result?.parentName).toBeUndefined();
    });

    it('resolves child domain slug with parent info', () => {
      const result = resolveDomainSlug('technology/blockchain');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Blockchain');
      expect(result?.parentName).toBe('Technology');
      expect(result?.fullPath).toBe('Technology > Blockchain');
    });

    it('returns null for unknown slug', () => {
      const result = resolveDomainSlug('unknown_domain');
      expect(result).toBeNull();
    });
  });

  describe('resolveSlug', () => {
    it('resolves skill when type is skill', () => {
      const result = resolveSlug('natural_language_processing', 'skill');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Natural Language Processing');
    });

    it('resolves domain when type is domain', () => {
      const result = resolveSlug('technology', 'domain');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Technology');
    });
  });

  describe('getSkillTree', () => {
    it('returns skills taxonomy categories', () => {
      const tree = getSkillTree();
      expect(tree).toBe(SKILLS_TAXONOMY.categories);
      expect(tree.length).toBe(15);
    });
  });

  describe('getDomainTree', () => {
    it('returns domains taxonomy categories', () => {
      const tree = getDomainTree();
      expect(tree).toBe(DOMAINS_TAXONOMY.categories);
      expect(tree.length).toBe(24);
    });
  });

  describe('getTaxonomyTree', () => {
    it('returns skills tree for skill type', () => {
      const tree = getTaxonomyTree('skill');
      expect(tree).toBe(SKILLS_TAXONOMY.categories);
    });

    it('returns domains tree for domain type', () => {
      const tree = getTaxonomyTree('domain');
      expect(tree).toBe(DOMAINS_TAXONOMY.categories);
    });
  });

  describe('searchTaxonomy', () => {
    it('finds skills matching query', () => {
      const results = searchTaxonomy('language', 'skill');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.name.includes('Language'))).toBe(true);
    });

    it('finds domains matching query', () => {
      const results = searchTaxonomy('tech', 'domain');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.slug.includes('tech'))).toBe(true);
    });

    it('returns empty array for empty query', () => {
      const results = searchTaxonomy('', 'skill');
      expect(results).toHaveLength(0);
    });

    it('returns empty array for whitespace query', () => {
      const results = searchTaxonomy('   ', 'skill');
      expect(results).toHaveLength(0);
    });

    it('searches case-insensitively', () => {
      const results = searchTaxonomy('BLOCKCHAIN', 'domain');
      expect(results.length).toBeGreaterThan(0);
    });

    it('searches in slug as well as name', () => {
      const _results = searchTaxonomy('nlp', 'skill');
      // Should not find anything as NLP is not in slugs
      // but searching for partial slug should work
      const results2 = searchTaxonomy('natural_language', 'skill');
      expect(results2.length).toBeGreaterThan(0);
    });
  });

  describe('getChildSlugs', () => {
    it('returns parent and all child slugs for skills', () => {
      const slugs = getChildSlugs('natural_language_processing', 'skill');
      expect(slugs).toContain('natural_language_processing');
      expect(slugs).toContain('natural_language_processing/natural_language_understanding');
      expect(slugs.length).toBeGreaterThan(1);
    });

    it('returns parent and all child slugs for domains', () => {
      const slugs = getChildSlugs('technology', 'domain');
      expect(slugs).toContain('technology');
      expect(slugs).toContain('technology/blockchain');
      expect(slugs.length).toBeGreaterThan(1);
    });

    it('returns only the slug itself for leaf nodes', () => {
      const slugs = getChildSlugs('technology/blockchain', 'domain');
      expect(slugs).toEqual(['technology/blockchain']);
    });

    it('returns empty array for non-existent slug', () => {
      const slugs = getChildSlugs('non_existent', 'skill');
      expect(slugs).toHaveLength(0);
    });
  });

  describe('slugMatchesSelection', () => {
    it('matches direct slug', () => {
      expect(
        slugMatchesSelection('technology/blockchain', ['technology/blockchain'], 'domain'),
      ).toBe(true);
    });

    it('matches when parent is selected', () => {
      expect(slugMatchesSelection('technology/blockchain', ['technology'], 'domain')).toBe(true);
    });

    it('matches when child is selected and checking parent', () => {
      expect(slugMatchesSelection('technology', ['technology/blockchain'], 'domain')).toBe(true);
    });

    it('does not match unrelated slugs', () => {
      expect(slugMatchesSelection('healthcare/telemedicine', ['technology'], 'domain')).toBe(false);
    });

    it('handles case insensitivity', () => {
      expect(slugMatchesSelection('TECHNOLOGY/BLOCKCHAIN', ['technology'], 'domain')).toBe(true);
    });

    it('handles empty selection', () => {
      expect(slugMatchesSelection('technology', [], 'domain')).toBe(false);
    });
  });

  describe('getOASFVersion', () => {
    it('returns the OASF version', () => {
      expect(getOASFVersion()).toBe('0.8.0');
    });
  });
});
