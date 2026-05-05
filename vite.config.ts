import { fileURLToPath } from 'node:url';

import { fmt, react } from '@k8o/oxc-config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import reactPlugin from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    ...fmt,
    ignorePatterns: [
      'CHANGELOG.md',
      'dist/**',
      'storybook-static/**',
      'manager.js',
      'preview.js',
      '.changeset/**',
    ],
  },
  lint: {
    extends: [react],
    ignorePatterns: [
      'CHANGELOG.md',
      'dist/**',
      'storybook-static/**',
      'manager.js',
      'preview.js',
      '.changeset/**',
    ],
    options: {
      reportUnusedDisableDirectives: 'error',
    },
    settings: {
      react: { version: '19.2.1' },
    },
    overrides: [
      {
        files: ['**/*.stories.{ts,tsx}', '**/.storybook/**/*.{ts,tsx}'],
        rules: {
          'no-console': 'off',
          'typescript/strict-void-return': 'off',
          'typescript/no-floating-promises': 'off',
          'typescript/no-misused-promises': 'off',
          'typescript/no-non-null-assertion': 'off',
          'typescript/no-unsafe-assignment': 'off',
        },
      },
    ],
  },
  staged: {
    '*.{js,ts,cjs,mjs,jsx,tsx,json,jsonc}': 'vp check --fix',
  },
  pack: {
    entry: ['src/manager.ts', 'src/preview.ts'],
    format: 'esm',
    dts: true,
    platform: 'browser',
    external: [
      'react',
      'react-dom',
      '@storybook/icons',
      '@sinonjs/fake-timers',
    ],
    clean: true,
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: fileURLToPath(new URL('./.storybook', import.meta.url)),
            storybookScript: 'pnpm storybook --ci',
          }),
        ],
        optimizeDeps: {
          include: ['@sinonjs/fake-timers'],
        },
        test: {
          name: { label: 'storybook', color: 'magenta' },
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            screenshotFailures: false,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
  plugins: [reactPlugin()],
});
