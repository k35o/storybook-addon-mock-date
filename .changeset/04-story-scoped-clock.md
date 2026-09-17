---
'storybook-addon-mock-date': major
---

The mock now lives as long as the story. It is installed from a project-level `beforeEach` hook instead of a decorator and removed when Storybook tears the story down.

- A mocked story no longer leaks its clock into the next one: the next story starts on the native `Date`, `Temporal`, `Intl` and timers, and installs its own mock only if it asks for one.
- A story's own `beforeEach` hooks run after the addon's, so they already see the mocked time; `loaders` still run before it and see the real clock.
- New `mockingDate: { disable: true }` runs a story on the real clock, ignoring any `mockingDate` inherited from the meta or preview level and any toolbar override. Use it for stories that fake timers themselves (`vi.useFakeTimers()` throws "Can't install fake timers twice" in a mocked story) or that render a library the mock breaks; `disable: false` turns the mock back on inside a disabled meta.
- The annotations of the `/preview` entry carry a `beforeEach` hook instead of `decorators`. Projects that spread the entry into a plain-object `preview.ts` or register it through `definePreview` are unaffected.
