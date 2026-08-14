---
'storybook-addon-mock-date': minor
---

Add CSF factories (CSF Next) support: the package root now exports a `definePreviewAddon` factory, so the addon can be registered with `definePreview({ addons: [mockDate()] })` and the `mockingDate` parameter and global are type-checked in `preview.meta()` / `meta.story()`. The root entry also re-exports `advanceMockedTime` / `runAllMockedTimers` / `getMockedClock`, sharing the clock with the `/preview` entry.
