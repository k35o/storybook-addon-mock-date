# Storybook Addon Mocking Date

A [Storybook](https://storybook.js.org/) addon that mocks the current time — `Date`, `Temporal.Now`, and `Intl.DateTimeFormat` — for individual stories using [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers). Useful for components that read the current date or time and need deterministic snapshots, visual regression tests, or coverage of time-sensitive UI such as relative timestamps and seasonal greetings.

## Requirements

- Storybook `^11.0.0`
- Node.js `>=22.12.0` (Storybook 11's own requirement)
- Renderer-agnostic — the addon ships a preview decorator that works with any Storybook framework (React, Vue, Svelte, etc.)

## Installation

First, install the package.

```sh
npm install --save-dev storybook-addon-mock-date
```

Then, register it in two places: `.storybook/preview.ts` applies the decorator, and `.storybook/main.ts` adds the toolbar.

```ts
// .storybook/preview.ts

// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite)
import { definePreview } from '@storybook/your-framework';
import mockDate from 'storybook-addon-mock-date';

export default definePreview({
  // ...rest of preview
  addons: [mockDate()], // 👈 applies the decorator
});
```

```ts
// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite)
import { defineMain } from '@storybook/your-framework/node';

export default defineMain({
  // ...rest of config
  addons: [
    'storybook-addon-mock-date', // 👈 adds the toolbar
  ],
});
```

Don't skip the `preview.ts` entry. Once `preview.ts` calls `definePreview` ([CSF Next](https://storybook.js.org/docs/api/csf/csf-next), Storybook 11's default), Storybook ignores the preview annotations that addons register through `main.ts`, so without it the decorator never runs and every story silently sees the real clock. Registering through `definePreview` also types the `mockingDate` parameter and global in `preview.meta()` and `meta.story()`.

If your `preview.ts` still exports a plain object instead of calling `definePreview`, the `main.ts` entry alone is enough: Storybook applies the addon's preview annotations for you.

`npx storybook add storybook-addon-mock-date` also works. It adds the `main.ts` entry and puts `import * as storybookAddonMockDate from 'storybook-addon-mock-date/preview'` into `definePreview`'s `addons`, which applies the decorator but leaves `mockingDate` untyped — replace it with `mockDate()` to get the types.

## Usage

Pass a `Date`, a millisecond timestamp, an ISO 8601 string, or a `Temporal.Instant` / `Temporal.ZonedDateTime` via the `mockingDate` parameter at the story, meta, or preview level. Storybook merges parameters with the most specific value winning, so the precedence is **story > meta > preview**.

```ts
// Button.stories.ts
import preview from '#.storybook/preview';

import { Button } from './Button';

const meta = preview.meta({
  component: Button,
  parameters: {
    mockingDate: new Date(2024, 3, 1),
  },
});

export const AddParametersAtStory = meta.story({
  parameters: {
    mockingDate: new Date(2023, 6, 1),
  },
});

export const AddParametersAtMeta = meta.story();
```

```ts
// .storybook/preview.ts
export default definePreview({
  addons: [mockDate()],
  parameters: {
    mockingDate: new Date(2024, 0, 1),
  },
});
```

A story whose merged `mockingDate` is `undefined` runs on the real clock: the decorator uninstalls the fake one, so `Date`, `Temporal`, `Intl`, and any timers an earlier story faked go back to their native implementations.

### Faking other timers

By default `mockingDate` freezes the APIs that read the current time — `Date`, `Temporal.Now`, and zero-argument `Intl.DateTimeFormat#format` (see [What gets mocked](#what-gets-mocked)). Scheduling APIs like `setTimeout` / `setInterval` / `requestAnimationFrame` / `performance` stay real until you pass the **object form** of `mockingDate` with a `fake` array — its values map directly to [`@sinonjs/fake-timers`' `toFake`](https://github.com/sinonjs/fake-timers#var-clock--faketimersinstallconfig):

```ts
export const Toast = meta.story({
  parameters: {
    mockingDate: {
      now: '2024-01-01T00:00:00',
      // intercept the auto-dismiss timer so the toast never races the screenshot
      fake: ['Date', 'Temporal', 'Intl', 'setTimeout', 'clearTimeout'],
    },
  },
});
```

An explicit `fake` array **replaces** the default entirely, so list the clock readers you still want frozen next to the timers — `fake: ['setTimeout']` fakes only `setTimeout` and leaves `Date` real. When `fake` is omitted (including the scalar form) it defaults to `['Date', 'Temporal', 'Intl']`.

To keep an API on the real clock, leave it out of an explicit `fake` array — for example when a library trips over the `Intl` fake:

```ts
export const ChristmasBanner = meta.story({
  parameters: {
    mockingDate: {
      now: '2024-12-25T12:00:00Z',
      // keep Intl.DateTimeFormat native for a library that subclasses it
      fake: ['Date', 'Temporal'],
    },
  },
});
```

> **rAF needs `performance`.** Animation libraries (framer-motion, react-spring, GSAP, Lottie, three.js) compute their delta from `performance.now()`, so fake `requestAnimationFrame` **and** `performance` together — faking rAF alone leaves the solver with a zero/NaN delta.

> **A zero-delay `setTimeout` still runs.** Only timeouts of at least 1 ms wait for the clock: `setTimeout(fn)` and `setTimeout(fn, 0)` run on the real timer, with `Date` still reading the mocked instant inside the callback. user-event, and Testing Library under Storybook's React renderer, wait on such a timeout inside every interaction and query, so freezing it would hang `userEvent` and `findBy*` in `play`. Code that defers work with a zero-delay timeout therefore runs it as a real browser would; to show a state that only lasts until then (a one-tick loading indicator, say), render it through props or args.

> **Faking `setTimeout` also freezes Storybook's own timers.** After `play`, Storybook waits on `setTimeout` before it reports the story as rendered, so in the Storybook UI such a story never finishes rendering: the Interactions panel stays on "RUNS" without listing any step, and `STORY_RENDERED` is never emitted, so anything waiting for that event waits forever. Tests run through `@storybook/addon-vitest` take a different path and are unaffected. If a tool captures stories by waiting for `STORY_RENDERED`, leave `setTimeout` real in the stories it has to capture.

> **Don't mix in `vi.useFakeTimers()`.** The addon installs `@sinonjs/fake-timers` itself and keeps its clock installed between stories, so `vi.useFakeTimers()` in a Storybook that relies on its mocking fails with "Can't install fake timers twice on the same global object" — even in a story the addon doesn't mock. Fake timers through the `fake` option and advance them with `advanceMockedTime` / `runAllMockedTimers` instead.

### Advancing time in `play`

Faking a timer _freezes_ it. To reach a settled "after" state (a dismissed toast, a finished count-up, an elapsed countdown), advance the clock from a story's `play` function with `advanceMockedTime` — **after** the component has mounted and registered its timers:

```ts
import { advanceMockedTime } from 'storybook-addon-mock-date';

export const AfterDismiss = meta.story({
  parameters: { mockingDate: { fake: ['setTimeout'] } },
  play: async ({ canvas }) => {
    advanceMockedTime(4000); // run the auto-dismiss timeout
    // assert the dismissed state…
  },
});
```

`runAllMockedTimers()` (drain every scheduled timer) and `getMockedClock()` (the raw `@sinonjs/fake-timers` clock) are exported alongside it for finer control.

> Import these helpers from `storybook-addon-mock-date` or `storybook-addon-mock-date/preview` — both entries share the decorator's module-level clock. A copy of the addon bundled any other way gets a disconnected instance and a "called without an installed clock" error.

> Advancing has to happen in `play`, not in a decorator: a component registers its timers in an effect that runs _after_ mount, so a decorator-level tick would fire before any timer exists.

### Toolbar override

The addon registers a clock icon in the Storybook toolbar. Clicking it opens a popover with a `datetime-local` input and a **Reset to real time** button.

![Toolbar icon and popover](https://raw.githubusercontent.com/k35o/storybook-addon-mock-date/main/.github/screenshots/02-toolbar-open.png)

Picking a date stores it in `globals.mockingDate` and applies the mock immediately to every story you visit, regardless of what `parameters.mockingDate` is set to. Press **Reset to real time** (or clear the input) to drop the override and fall back to the parameter-based mocking.

The full precedence with the toolbar in play is **toolbar (globals) > story > meta > preview**. So a story with its own `parameters.mockingDate` only shows that date until the toolbar override is engaged.

This is intended for ad-hoc exploration — checking how a "happy birthday" banner looks on the actual day, walking through the same story across a year, etc. — without editing source files. Permanent mocking should still go through `parameters.mockingDate` so the value lives in version control.

#### Disabling the toolbar (decorator-only mode)

The toolbar comes from the `main.ts` entry and the decorator from the `preview.ts` one. If you want the date mocking without the clock icon, keep `mockDate()` in `.storybook/preview.ts` and leave the addon out of `.storybook/main.ts`:

```ts
// .storybook/main.ts
export default defineMain({
  // 'storybook-addon-mock-date' is intentionally not listed here
  addons: [/* ... */],
});
```

The decorator runs the same way; only the toolbar manager bundle is skipped. With a plain-object `preview.ts`, spread the `/preview` entry into it instead (`import mockDate from 'storybook-addon-mock-date/preview'`, then `...mockDate`).

### What gets mocked

By default the APIs that read the current time are replaced; scheduling APIs are opt-in through the `fake` option (see [Faking other timers](#faking-other-timers)):

- **`'Date'`** (default) — the `Date` constructor and its static methods (`Date.now`, `Date.parse`, etc.).
- **`'Temporal'`** (default) — replaces the `Temporal.Now` namespace (`instant()`, `zonedDateTimeISO()`, `plainDateISO()`, …), in browsers that ship [native `Temporal`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal#browser_compatibility) (Chrome/Edge 144+, Firefox 139+, Node.js 26+). Where `Temporal` doesn't exist yet the entry is skipped harmlessly. Imported polyfills (`temporal-polyfill`, `@js-temporal/polyfill`) bypass the global and are not replaced, but they derive the current time from `Date.now()` internally, so the `Date` fake pins them at millisecond precision.
- **`'Intl'`** (default) — routes zero-argument `Intl.DateTimeFormat` `format()` / `formatToParts()` calls, which read the system clock directly rather than going through `Date.now`, through the mocked clock. To do that, `@sinonjs/fake-timers` swaps `Intl.DateTimeFormat` for a wrapper while a story is mocked. Code that works with the formatter itself can notice it — leave `'Intl'` out of `fake` in a story that runs into one of these:
  - A falsy date argument counts as absent, so `format(0)` formats the mocked instant instead of the epoch.
  - Formatters are not `instanceof Intl.DateTimeFormat`, and a subclass of it loses its own methods.
  - The wrapper copies `Intl` when the addon loads, so an `Intl` polyfill applied later is not visible while a story is mocked. Import polyfills above `storybook-addon-mock-date` in `.storybook/preview.ts`.
- **Scheduling APIs** (`'setTimeout'`, `'setInterval'`, `'requestAnimationFrame'`, `'performance'`, and the rest) — opt-in; freezes timers so timer-driven UI can be advanced deterministically from `play`.

### What stays real

- **The timezone.** The addon freezes the _instant_, not the environment: `Date.prototype.getTimezoneOffset()`, `Intl.DateTimeFormat().resolvedOptions().timeZone`, and `Temporal.Now.timeZoneId()` all keep reporting the host's timezone. To render a story as if in another timezone, launch the browser with one — e.g. Playwright's `timezoneId` option or the `TZ` environment variable.
- **Values captured before the decorator runs.** A module-scope `const now = new Date()` is evaluated at import time, before any story's mock is installed. Likewise, an `Intl.DateTimeFormat` created at module scope is the native one, so its zero-argument `format()` keeps reading the real clock.
- **Other realms.** Web Workers, Service Workers, and other iframes have their own globals; the mock is installed only in the preview iframe.
- **Everything outside the JS clock.** CSS animations/transitions, the Web Animations API, `IntersectionObserver`/`ResizeObserver`, `AbortSignal.timeout()`, and network requests are unaffected — disable or mock those separately for stable visual snapshots.

### Multiple stories in a docs page

Stories rendered together on the same docs page (e.g. autodocs pages, MDX pages with several `<Canvas>` blocks) share one set of mocked globals (`Date`, `Temporal`, `Intl`), because the underlying `@sinonjs/fake-timers` installs the mock globally. Each story's `mockingDate` is applied correctly during its initial render — so static snapshots show the expected date for every story — but any code that reads the clock _after_ that render sees whichever story's mock was installed last. Live-updating UI such as countdowns, "time ago" labels that refresh, or running clocks will therefore all converge on a single value across the page.

If you need each story on a docs page to keep its own `mockingDate` for ongoing `new Date()` reads, render the stories in separate iframes by setting `parameters.docs.story.inline` to `false`:

```ts
// .storybook/preview.ts
export default definePreview({
  addons: [mockDate()],
  parameters: {
    docs: {
      story: { inline: false },
    },
  },
});
```

Each iframe gets its own globals, so the mocks no longer leak between stories. The tradeoff is the extra iframe startup cost per story on the page.
