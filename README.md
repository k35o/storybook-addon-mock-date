# Storybook Addon Mocking Date

A [Storybook](https://storybook.js.org/) addon that mocks the JavaScript `Date` for individual stories using [`@sinonjs/fake-timers`](https://github.com/sinonjs/fake-timers). Useful for components that read the current date or time and need deterministic snapshots, visual regression tests, or coverage of time-sensitive UI such as relative timestamps and seasonal greetings.

## Requirements

- Storybook `^10.0.0`
- Renderer-agnostic — the addon ships a preview decorator that works with any Storybook framework (React, Vue, Svelte, etc.)

## Installation

First, install the package.

```sh
npm install --save-dev storybook-addon-mock-date
```

Then, register it as an addon in `.storybook/main.ts`.

```ts
// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  // ...rest of config
  addons: [
    'storybook-addon-mock-date', // 👈 register the addon here
  ],
};

export default config;
```

## Usage

Pass a `Date`, a millisecond timestamp, or an ISO 8601 string via the `mockingDate` parameter at the story, meta, or preview level. Storybook merges parameters with the most specific value winning, so the precedence is **story > meta > preview**.

```ts
// Button.stories.ts

// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    mockingDate: new Date(2024, 3, 1),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const AddParametersAtStory: Story = {
  parameters: {
    mockingDate: new Date(2023, 6, 1),
  },
};

export const AddParametersAtMeta: Story = {};
```

```ts
// .storybook/preview.ts

// Replace your-renderer with the name of your renderer
import type { Preview } from '@storybook/your-renderer';

const preview: Preview = {
  parameters: {
    mockingDate: new Date(2024, 0, 1),
  },
};

export default preview;
```

A story whose merged `mockingDate` is `undefined` reverts the system clock to the moment the preview iframe loaded, so subsequent stories continue to see a deterministic value rather than continuing to drift forward.

### Faking other timers

By default only `Date` is mocked. To freeze other JavaScript time sources too, pass the **object form** of `mockingDate` with a `fake` array — its values map directly to [`@sinonjs/fake-timers`' `toFake`](https://github.com/sinonjs/fake-timers#var-clock--faketimersinstallconfig) (e.g. `'setTimeout'`, `'setInterval'`, `'requestAnimationFrame'`, `'performance'`):

```ts
export const Toast: Story = {
  parameters: {
    mockingDate: {
      now: '2024-01-01T00:00:00',
      // intercept the auto-dismiss timer so the toast never races the screenshot
      fake: ['Date', 'setTimeout', 'clearTimeout'],
    },
  },
};
```

The scalar form (`mockingDate: new Date(...)`, a timestamp, or an ISO string) is unchanged and still fakes only `Date`, so existing stories keep working as-is. When `fake` is omitted it defaults to `['Date']`.

> **rAF needs `performance`.** Animation libraries (framer-motion, react-spring, GSAP, Lottie, three.js) compute their delta from `performance.now()`, so fake `requestAnimationFrame` **and** `performance` together — faking rAF alone leaves the solver with a zero/NaN delta.

### Advancing time in `play`

Faking a timer _freezes_ it. To reach a settled "after" state (a dismissed toast, a finished count-up, an elapsed countdown), advance the clock from a story's `play` function with `advanceMockedTime` — **after** the component has mounted and registered its timers:

```ts
import { advanceMockedTime } from 'storybook-addon-mock-date/preview';

export const AfterDismiss: Story = {
  parameters: { mockingDate: { fake: ['setTimeout'] } },
  play: async ({ canvas }) => {
    advanceMockedTime(4000); // run the auto-dismiss timeout
    // assert the dismissed state…
  },
};
```

`runAllMockedTimers()` (drain every scheduled timer) and `getMockedClock()` (the raw `@sinonjs/fake-timers` clock) are also exported from `storybook-addon-mock-date/preview` for finer control.

> Always import these helpers from `storybook-addon-mock-date/preview` — the same entry the decorator ships from. They share a single module-level clock, so importing from any other path gives you a disconnected instance and a "called without an installed clock" error.

> Advancing has to happen in `play`, not in a decorator: a component registers its timers in an effect that runs _after_ mount, so a decorator-level tick would fire before any timer exists.

### Toolbar override

The addon registers a clock icon in the Storybook toolbar. Clicking it opens a popover with a `datetime-local` input and a **Reset to real time** button.

![Toolbar icon and popover](https://raw.githubusercontent.com/k35o/storybook-addon-mock-date/main/.github/screenshots/02-toolbar-open.png)

Picking a date stores it in `globals.mockingDate` and applies the mock immediately to every story you visit, regardless of what `parameters.mockingDate` is set to. Press **Reset to real time** (or clear the input) to drop the override and fall back to the parameter-based mocking.

The full precedence with the toolbar in play is **toolbar (globals) > story > meta > preview**. So a story with its own `parameters.mockingDate` only shows that date until the toolbar override is engaged.

This is intended for ad-hoc exploration — checking how a "happy birthday" banner looks on the actual day, walking through the same story across a year, etc. — without editing source files. Permanent mocking should still go through `parameters.mockingDate` so the value lives in version control.

#### Disabling the toolbar (decorator-only mode)

If you want the date mocking but don't want the clock icon in the toolbar, register the preview entry directly in `.storybook/preview.ts` instead of listing the addon in `.storybook/main.ts`:

```ts
// .storybook/preview.ts
import type { Preview } from '@storybook/your-renderer';
import mockDate from 'storybook-addon-mock-date/preview';

const preview: Preview = {
  ...mockDate,
  parameters: {
    mockingDate: new Date(2024, 0, 1),
  },
};

export default preview;
```

```ts
// .storybook/main.ts
const config: StorybookConfig = {
  // 'storybook-addon-mock-date' is intentionally not listed here
  addons: [
    /* ... */
  ],
};
```

The decorator runs the same way; only the toolbar manager bundle is skipped.

### What gets mocked

By default only the `Date` constructor and its static methods (`Date.now`, `Date.parse`, etc.) are replaced; `setTimeout`, `setInterval`, `requestAnimationFrame`, and the rest of the timer APIs keep using the host clock. Opt into faking any of them per story with the `fake` option (see [Faking other timers](#faking-other-timers)).

Note that `@sinonjs/fake-timers` only controls JavaScript timers and the clock. CSS animations/transitions, the Web Animations API, `IntersectionObserver`/`ResizeObserver`, and network requests are unaffected — disable or mock those separately for stable visual snapshots.

### Multiple stories in a docs page

Stories rendered together on the same docs page (e.g. autodocs pages, MDX pages with several `<Canvas>` blocks) share one `globalThis.Date`, because the underlying `@sinonjs/fake-timers` installs the mock globally. Each story's `mockingDate` is applied correctly during its initial render — so static snapshots show the expected date for every story — but any code that reads `Date` _after_ that render sees whichever story's mock was installed last. Live-updating UI such as countdowns, "time ago" labels that refresh, or running clocks will therefore all converge on a single value across the page.

If you need each story on a docs page to keep its own `mockingDate` for ongoing `new Date()` reads, render the stories in separate iframes by setting `parameters.docs.story.inline` to `false`:

```ts
// .storybook/preview.ts
const preview: Preview = {
  parameters: {
    docs: {
      story: { inline: false },
    },
  },
};
```

Each iframe gets its own `globalThis.Date`, so the mocks no longer leak between stories. The tradeoff is the extra iframe startup cost per story on the page.
