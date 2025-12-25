import type { MetadataRoute } from 'next';

/**
 * Web App Manifest for PWA support
 * Enables "Add to Home Screen" functionality
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
 * @see https://web.dev/add-manifest/
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Agent Explorer - ERC-8004 Agent Discovery',
    short_name: 'Agent Explorer',
    description:
      'Discover and explore autonomous AI agents registered on the ERC-8004 (Trustless Agents) standard across multiple blockchain networks.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#5C94FC',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['business', 'developer tools', 'utilities'],
    lang: 'en',
    dir: 'ltr',
  };
}
