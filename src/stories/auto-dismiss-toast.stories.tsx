import type { Meta, StoryObj } from '@storybook/react-vite';
import { advanceMockedTime } from 'storybook-addon-mock-date/preview';
import { expect } from 'storybook/test';

import { AutoDismissToast } from './auto-dismiss-toast';

const meta = {
  component: AutoDismissToast,
  args: { message: '保存しました', duration: 4000 },
  parameters: {
    // Freeze Date and intercept setTimeout so the auto-dismiss never fires on
    // its own — assertions and screenshots no longer race the 4s timer.
    mockingDate: {
      now: '2024-01-01T00:00:00',
      fake: ['Date', 'setTimeout', 'clearTimeout'],
    },
  },
} satisfies Meta<typeof AutoDismissToast>;

export default meta;

type Story = StoryObj<typeof meta>;

// setTimeout is faked, so yield through a real rAF to let React commit the
// state update produced by advancing the clock.
const flush = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });

// Frozen at t=0: the toast stays visible because its timer never auto-fires.
export const Shown: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('保存しました');
  },
};

// Advance past the duration inside play to capture the dismissed state.
export const AfterDismiss: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toBeInTheDocument();
    advanceMockedTime(4000);
    await flush();
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
  },
};
