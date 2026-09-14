import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { CurrentIntlDate } from './current-intl-date';

const meta = preview.meta({
  component: CurrentIntlDate,
});

// Zero-arg `Intl.DateTimeFormat#format` reads the system clock directly rather
// than going through `Date.now`; the scalar form routes it through the mocked
// clock too.
export const FakedIntlFormat = meta.story({
  parameters: {
    mockingDate: '2024-07-01T12:00:00Z',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent('2024年7月1日');
  },
});

// An explicit `fake` replaces the default set, so leaving 'Intl' out keeps
// zero-arg `format()` on the real clock while `Date` is frozen.
export const LeavingIntlOutKeepsTheRealClock = meta.story({
  parameters: {
    mockingDate: {
      now: '2024-07-01T12:00:00Z',
      fake: ['Date'],
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).not.toHaveTextContent(
      '2024年7月1日',
    );
  },
});
