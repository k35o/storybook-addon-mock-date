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

### Toolbar override

The addon registers a clock icon in the Storybook toolbar. Picking a date there sets a global `mockingDate` value that overrides any `parameters.mockingDate` for every story until you press **Reset to real time**. Useful for spot-checking a component at different points in time without editing the story.

The full precedence with the toolbar in play is **toolbar (globals) > story > meta > preview**.

### What gets mocked

Only the `Date` constructor and its static methods (`Date.now`, `Date.parse`, etc.) are replaced. `setTimeout`, `setInterval`, `requestAnimationFrame`, and the rest of the timer APIs continue to use the host clock unchanged.
