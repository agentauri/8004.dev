import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

const theme = create({
  base: 'dark',
  brandTitle: 'Agent Explorer',
  brandUrl: '/',

  // Colors
  colorPrimary: '#5C94FC',
  colorSecondary: '#5C94FC',

  // UI
  appBg: '#1A1A1A',
  appContentBg: '#000000',
  appBorderColor: '#3A3A3A',
  appBorderRadius: 0,

  // Text colors
  textColor: '#DADADA',
  textInverseColor: '#000000',

  // Toolbar
  barTextColor: '#9A9A9A',
  barSelectedColor: '#5C94FC',
  barBg: '#2A2A2A',

  // Form colors
  inputBg: '#2A2A2A',
  inputBorder: '#3A3A3A',
  inputTextColor: '#DADADA',
  inputBorderRadius: 0,
});

addons.setConfig({
  theme,
  sidebar: {
    showRoots: true,
    collapsedRoots: [],
  },
});
