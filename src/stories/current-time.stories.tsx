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
// runs on the real clock rather than the epoch. The type rejects this shape;
// it still reaches the runtime from untyped CSF 3 stories.
export const ClockReadersWithoutADateKeepTheRealClock = meta.story({
  parameters: {
    // @ts-expect-error -- clock readers without a `now` mock nothing
    mockingDate: { fake: ['Date'] },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).not.toHaveTextContent(
      '1970-01-01T00:00:00.000Z',
    );
  },
});

// A timer API still needs a clock, which starts at the epoch. Listing a clock
// reader next to it without a `now` is rejected by the type as well.
export const TimersWithoutADateStartAtTheEpoch = meta.story({
  parameters: {
    // @ts-expect-error -- `Date` without a `now` needs the scalar or `now` form
    mockingDate: { fake: ['Date', 'setInterval'] },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent(
      '1970-01-01T00:00:00.000Z',
    );
  },
});
