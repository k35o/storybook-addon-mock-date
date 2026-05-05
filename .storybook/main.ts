import type { StorybookConfig } from '@storybook/react-vite';
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
    import.meta.resolve('./local-preset.ts'),
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};
export default config;
