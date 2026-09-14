import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import reactPlugin from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// Not in vite.config.ts: vite-plus's defineConfig resolves the browser tests'
// `vitest` / `@vitest/*` imports to the vitest bundled with vite-plus rather
// than the one `pnpm test` runs, and the browser tester fails to start once
// their versions differ.
export default defineConfig({
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
