import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { CurrentIntlDate } from './current-intl-date';

const meta = {
  component: CurrentIntlDate,
} satisfies Meta<typeof CurrentIntlDate>;

export default meta;

type Story = StoryObj<typeof meta>;

// Adding 'Intl' to `fake` routes zero-arg `Intl.DateTimeFormat#format`
// through the mocked clock; without it the call reads the real system time
// even while `Date` is faked.
export const FakedIntlFormat: Story = {
  parameters: {
    mockingDate: {
      now: '2024-07-01T12:00:00Z',
      fake: ['Date', 'Intl'],
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent('2024年7月1日');
  },
};
