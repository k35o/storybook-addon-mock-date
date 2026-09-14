---
'storybook-addon-mock-date': major
---

Support Storybook 11.

- Requires Storybook 11: `peerDependencies.storybook` is now `^11.0.0`. Stay on 3.x for Storybook 10.
- Requires Node.js 22.12 or later (`engines.node` is `>=22.12.0`), matching Storybook 11's own requirement.
- The toolbar's date picker now opens through `PopoverProvider` instead of `WithTooltip`, whose click trigger and interactive content Storybook 11 removes. It looks and behaves the same — click the clock icon to open it, press Escape or click outside to close it — and is announced as a dialog named "Mocked date".
- CSF Next is Storybook 11's default, so the README now leads with registering `mockDate()` in `.storybook/preview.ts` through `definePreview({ addons: [mockDate()] })`. Once `preview.ts` calls `definePreview`, Storybook ignores the preview annotations that addons register through `main.ts`, so a project registered only in `main.ts` silently runs without the decorator. Keep the `main.ts` entry for the toolbar.
