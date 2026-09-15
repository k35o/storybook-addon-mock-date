import { advanceMockedTime } from 'storybook-addon-mock-date';
import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { CurrentTime } from './current-time';
import { waitRealMs } from './wait-real-ms';

const meta = preview.meta({
  component: CurrentTime,
  parameters: {
    mockingDate: {
      now: '2024-01-01T00:00:00Z',
      fake: ['Date', 'setTimeout', 'clearTimeout'],
    },
  },
});

export const FindByQueriesResolve = meta.story({
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByText('2024-01-01T00:00:00.000Z'),
    ).toBeInTheDocument();
  },
});

export const ZeroDelayTimeoutRunsAtTheMockedInstant = meta.story({
  play: async () => {
    const firedAt = await new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(new Date().toISOString());
      }, 0);
    });
    await expect(firedAt).toBe('2024-01-01T00:00:00.000Z');
  },
});

export const OneMillisecondTimeoutWaitsForTheClock = meta.story({
  play: async () => {
    let fired = false;
    setTimeout(() => {
      fired = true;
    }, 1);
    await waitRealMs(50);
    await expect(fired).toBe(false);
    await advanceMockedTime(1);
    await expect(fired).toBe(true);
  },
});

export const ClearTimeoutCancelsZeroDelayTimeout = meta.story({
  play: async () => {
    let fired = false;
    const id = setTimeout(() => {
      fired = true;
    }, 0);
    clearTimeout(id);
    await waitRealMs(50);
    await expect(fired).toBe(false);
  },
});
