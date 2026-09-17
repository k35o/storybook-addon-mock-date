---
'storybook-addon-mock-date': patch
---

Projects set up with `npx storybook add storybook-addon-mock-date` (or migrated by the CSF Next codemod) now type-check. Both register the addon as `import * as storybookAddonMockDate from 'storybook-addon-mock-date/preview'` passed to `definePreview({ addons })`, which failed with TS2559 because the namespace shared no property with `PreviewAddon`. The `/preview` entry now also exports its annotations by name (`beforeEach` and `initialGlobals`). That form still leaves the `mockingDate` parameter untyped; register `mockDate()` from the package root to get the types.
