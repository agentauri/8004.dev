/**
 * Organization JSON-LD structured data
 * Helps search engines understand the website owner/organization
 *
 * @see https://schema.org/Organization
 */
export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Agent Explorer',
    url: 'https://www.8004.dev',
    logo: 'https://www.8004.dev/icon-512.png',
    description:
      'Agent Explorer is a discovery platform for autonomous AI agents registered on the ERC-8004 (Trustless Agents) standard.',
    sameAs: [
      // Add social media profiles when available
    ],
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML for structured data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
