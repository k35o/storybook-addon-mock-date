// `storybook add` and the CSF Next codemod register non-core addons as a
// namespace import of their `/preview` entry. This file only exists for
// `pnpm typecheck` to prove that form stays assignable to `definePreview`.
import { definePreview } from '@storybook/react-vite';
import * as storybookAddonMockDate from 'storybook-addon-mock-date/preview';

export default definePreview({
  addons: [storybookAddonMockDate],
});
