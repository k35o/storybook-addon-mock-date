import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { CurrentTime } from './current-time';

const metaDate = new Date(2023, 0, 1);
const storyDate = new Date(2023, 6, 1);

const meta = {
  component: CurrentTime,
  parameters: {
    mockingDate: metaDate,
  },
} satisfies Meta<typeof CurrentTime>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AddParametersAtStory: Story = {
  parameters: {
    mockingDate: storyDate,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent(
      storyDate.toISOString(),
    );
  },
};

export const AddParametersAtMeta: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent(
      metaDate.toISOString(),
    );
  },
};
