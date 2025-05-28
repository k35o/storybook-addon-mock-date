import type { Meta, StoryObj } from "@storybook/react-vite";

import { CurrentDate } from "./CurrentDate";

const meta = {
  component: CurrentDate,
} satisfies Meta<typeof CurrentDate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AddParametersAtStory: Story = {
  parameters: {
    mockingDate: new Date(2023, 6, 1),
  },
};

export const AddParametersAtPreview: Story = {};
