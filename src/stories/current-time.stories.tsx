import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { CurrentTime } from './current-time';

const metaDate = new Date(2023, 0, 1);
const storyDate = new Date(2023, 6, 1);

const meta = preview.meta({
  component: CurrentTime,
  parameters: {
    mockingDate: metaDate,
  },
});

export const AddParametersAtStory = meta.story({
  parameters: {
    mockingDate: storyDate,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent(
      storyDate.toISOString(),
    );
  },
});

export const AddParametersAtMeta = meta.story({
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent(
      metaDate.toISOString(),
    );
  },
});

// Without a date, clock readers have no instant to freeze at, so the story
// runs on the real clock rather than the epoch.
export const ClockReadersWithoutADateKeepTheRealClock = meta.story({
  parameters: {
    mockingDate: { fake: ['Date'] },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).not.toHaveTextContent(
      '1970-01-01T00:00:00.000Z',
    );
  },
});

// A timer API still needs a clock, which starts at the epoch.
export const TimersWithoutADateStartAtTheEpoch = meta.story({
  parameters: {
    mockingDate: { fake: ['Date', 'setInterval'] },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent(
      '1970-01-01T00:00:00.000Z',
    );
  },
});
