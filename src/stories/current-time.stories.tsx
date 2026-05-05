import type { Meta, StoryObj } from "@storybook/react-vite";

import { CurrentTime } from "./CurrentTime";

const meta = {
  component: CurrentTime,
  parameters: {
    mockingDate: new Date(2023, 0, 1),
  },
} satisfies Meta<typeof CurrentTime>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AddParametersAtStory: Story = {
  parameters: {
    mockingDate: new Date(2023, 6, 1),
  },
};

export const AddParametersAtMeta: Story = {};
