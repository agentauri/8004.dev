import type { Preview } from '@storybook/react-webpack5';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        "pixel-black": { name: 'pixel-black', value: '#000000' },
        "pixel-gray-dark": { name: 'pixel-gray-dark', value: '#1a1a1a' },
        "pixel-gray-800": { name: 'pixel-gray-800', value: '#2a2a2a' }
      }
    },
    viewport: {
      options: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
        },
        wide: {
          name: 'Wide Desktop',
          styles: { width: '1536px', height: '864px' },
        },
      },
    },
    layout: 'centered',
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
    options: {
      storySort: {
        order: [
          'Documentation',
          ['Introduction', 'Design Tokens', 'Components'],
          'Atoms',
          'Molecules',
          'Organisms',
          'Templates',
        ],
      },
    },
  },

  tags: ['autodocs'],

  initialGlobals: {
    backgrounds: {
      value: 'pixel-black'
    }
  }
};

export default preview;
