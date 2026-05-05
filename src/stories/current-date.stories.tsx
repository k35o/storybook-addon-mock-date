import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { CurrentDate } from './current-date';

const meta = {
  component: CurrentDate,
} satisfies Meta<typeof CurrentDate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AddParametersAtStory: Story = {
  parameters: {
    mockingDate: new Date(2023, 6, 1),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent('2023年7月1日');
  },
};

export const AddParametersAtPreview: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent('2024年1月1日');
  },
};

export const StringMockingDate: Story = {
  parameters: {
    mockingDate: '2025-06-15T00:00:00',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent('2025年6月15日');
  },
};

export const GlobalOverridesParameter: Story = {
  parameters: {
    mockingDate: new Date(2023, 6, 1),
  },
  globals: {
    mockingDate: '2026-03-14T00:00:00',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent('2026年3月14日');
  },
};
