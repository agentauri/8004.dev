// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import path, { dirname } from 'node:path';
import type { StorybookConfig } from '@storybook/react-webpack5';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-webpack5-compiler-babel',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-docs'
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  staticDirs: ['../public'],

  babel: async () => ({
    presets: [
      ['@babel/preset-react', { runtime: 'automatic' }],
      [
        '@babel/preset-typescript',
        {
          isTSX: true,
          allExtensions: true,
          onlyRemoveTypeImports: true,
        },
      ],
    ],
  }),

  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        'next/link': path.resolve(__dirname, './mocks/next-link.tsx'),
        'next/image': path.resolve(__dirname, './mocks/next-image.tsx'),
      };
    }

    // Define process.env for Next.js compatibility
    const webpack = await import('webpack');
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.default.DefinePlugin({
        'process.env': JSON.stringify({}),
      }),
    );

    // Configure CSS handling
    if (config.module?.rules) {
      // Remove ALL existing CSS rules to avoid conflicts
      config.module.rules = config.module.rules.filter((rule) => {
        if (!rule || typeof rule !== 'object') return true;
        if ('test' in rule && rule.test instanceof RegExp) {
          const testStr = rule.test.toString();
          if (testStr.includes('css')) return false;
        }
        return true;
      });

      // CSS modules rule - must come FIRST (more specific)
      config.module.rules.unshift({
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]--[hash:base64:5]',
                namedExport: false,
                exportLocalsConvention: 'as-is',
              },
            },
          },
        ],
      });

      // Regular CSS rule (globals, Tailwind)
      config.module.rules.push({
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['@tailwindcss/postcss', {}]],
              },
            },
          },
        ],
      });
    }

    return config;
  }
};

export default config;
