import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { CurrentTemporalDate } from './current-temporal-date';

const meta = preview.meta({
  component: CurrentTemporalDate,
});

// Adding 'Temporal' to `fake` freezes `Temporal.Now` alongside `Date`.
// Midday UTC keeps the derived calendar date identical across the timezones
// CI and dev machines run in.
export const FakedTemporalNow = meta.story({
  parameters: {
    mockingDate: {
      now: '2024-01-01T12:00:00Z',
      fake: ['Date', 'Temporal'],
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent('2024-01-01');
  },
});

// A `Temporal.Instant`-like value (anything carrying `epochMilliseconds`)
// works as `now`.
export const TemporalInstantNow = meta.story({
  parameters: {
    mockingDate: {
      now: { epochMilliseconds: Date.UTC(2024, 6, 1, 12) },
      fake: ['Date', 'Temporal'],
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent('2024-07-01');
  },
});
