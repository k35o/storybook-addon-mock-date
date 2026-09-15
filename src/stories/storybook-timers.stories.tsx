import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { CurrentTime } from './current-time';
import { waitRealMs } from './wait-real-ms';

const meta = preview.meta({
  component: CurrentTime,
});

// Storybook arms its own timers (e.g. the "preparing story" spinner) with the
// native setTimeout before the addon installs the clock, and clears them once
// the story has rendered. These mimic one such timer.
let armedBeforeClock: ReturnType<typeof setTimeout> | undefined;
let armedTimerFired = false;

export const ClearsTimersArmedBeforeTheClock = meta.story({
  parameters: {
    mockingDate: {
      now: '2024-01-01T00:00:00',
      fake: ['Date', 'setTimeout', 'clearTimeout'],
    },
  },
  beforeEach: () => {
    armedTimerFired = false;
    armedBeforeClock = setTimeout(() => {
      armedTimerFired = true;
    }, 500);
  },
  play: async () => {
    clearTimeout(armedBeforeClock);
    await waitRealMs(700);
    await expect(armedTimerFired).toBe(false);
  },
});
