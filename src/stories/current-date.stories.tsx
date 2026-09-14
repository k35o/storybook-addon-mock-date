import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { CurrentDate } from './current-date';

const meta = preview.meta({
  component: CurrentDate,
});

export const AddParametersAtStory = meta.story({
  parameters: {
    mockingDate: new Date(2023, 6, 1),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent('2023年7月1日');
  },
});

export const AddParametersAtPreview = meta.story({
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent('2024年1月1日');
  },
});

export const StringMockingDate = meta.story({
  parameters: {
    mockingDate: '2025-06-15T00:00:00',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent('2025年6月15日');
  },
});

// A `Temporal.Instant` / `Temporal.ZonedDateTime` (anything carrying
// `epochMilliseconds`) also works as the bare parameter. Midday UTC keeps the
// local calendar date identical across the timezones CI and dev machines run
// in.
export const TemporalInstantMockingDate = meta.story({
  parameters: {
    mockingDate: { epochMilliseconds: Date.UTC(2025, 2, 3, 12) },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent('2025年3月3日');
  },
});

export const GlobalOverridesParameter = meta.story({
  parameters: {
    mockingDate: new Date(2023, 6, 1),
  },
  globals: {
    mockingDate: '2026-03-14T00:00:00',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent('2026年3月14日');
  },
});
