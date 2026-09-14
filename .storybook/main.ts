import { defineMain } from '@storybook/react-vite/node';

export default defineMain({
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
});
