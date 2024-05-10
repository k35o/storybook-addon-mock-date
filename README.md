
# Storybook Addon Mocking Date

## Installation

First, install the package.

```sh
npm install --save-dev storybook-addon-mock-date
```

Then, register it as an addon in `.storybook/main.js`.

```js
// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  // ...rest of config
  addons: [
    '@storybook/addon-essentials'
    'storybook-addon-mock-date', // 👈 register the addon here
  ],
};

export default config;
```

## Usage

Mock the current time in `Date` by passing `Date | number` in `mockingDate` of `parameters`.

```js
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


```js
// .storybook/preview.ts

// Replace your-renderer with the name of you renderer
import type { Preview } from "@storybook/your-renderer";

const preview: Preview = {
  parameters: {
    mockingDate: new Date(2024, 0, 1),
  },
};

export default preview;
```
