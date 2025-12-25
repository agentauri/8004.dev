/**
 * BreadcrumbList JSON-LD structured data
 * Helps search engines understand page hierarchy
 *
 * @see https://schema.org/BreadcrumbList
 * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 */

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML for structured data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Pre-built breadcrumbs for common pages
 */

export function HomeBreadcrumb() {
  return (
    <BreadcrumbJsonLd
      items={[
        {
          name: 'Home',
          url: 'https://www.8004.dev',
        },
      ]}
    />
  );
}

export function ExploreBreadcrumb() {
  return (
    <BreadcrumbJsonLd
      items={[
        {
          name: 'Home',
          url: 'https://www.8004.dev',
        },
        {
          name: 'Explore Agents',
          url: 'https://www.8004.dev/explore',
        },
      ]}
    />
  );
}

export function TaxonomyBreadcrumb() {
  return (
    <BreadcrumbJsonLd
      items={[
        {
          name: 'Home',
          url: 'https://www.8004.dev',
        },
        {
          name: 'Taxonomy',
          url: 'https://www.8004.dev/taxonomy',
        },
      ]}
    />
  );
}

interface AgentBreadcrumbProps {
  agentId: string;
  agentName: string;
}

export function AgentBreadcrumb({ agentId, agentName }: AgentBreadcrumbProps) {
  return (
    <BreadcrumbJsonLd
      items={[
        {
          name: 'Home',
          url: 'https://www.8004.dev',
        },
        {
          name: 'Explore Agents',
          url: 'https://www.8004.dev/explore',
        },
        {
          name: agentName,
          url: `https://www.8004.dev/agent/${agentId}`,
        },
      ]}
    />
  );
}
