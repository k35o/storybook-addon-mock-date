import FakeTimers from '@sinonjs/fake-timers';
import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { CurrentTime } from './current-time';

const meta = preview.meta({
  component: CurrentTime,
});

// `performance` is never faked here, so its clock tells real time apart from
// a frozen `Date`.
const realNow = (): number => performance.timeOrigin + performance.now();

// The addon installs the clock before the story's own `beforeEach` runs.
let dateSeenInBeforeEach: number | undefined;

export const BeforeEachSeesTheMockedClock = meta.story({
  parameters: {
    mockingDate: '2024-06-01T00:00:00Z',
  },
  beforeEach: () => {
    dateSeenInBeforeEach = Date.now();
  },
  play: async () => {
    await expect(dateSeenInBeforeEach).toBe(
      new Date('2024-06-01T00:00:00Z').getTime(),
    );
  },
});

// The preview mocks every story at 2024-01-01; `disable` opts this one out.
export const DisabledStoryRunsOnTheRealClock = meta.story({
  parameters: {
    mockingDate: { disable: true },
  },
  play: async ({ canvas }) => {
    await expect(Math.abs(Date.now() - realNow())).toBeLessThan(60_000);
    await expect(canvas.getByRole('time')).not.toHaveTextContent('2024-01-01');
  },
});

// A toolbar date overrides every other `mockingDate`, but not `disable`.
export const DisableWinsOverTheToolbar = meta.story({
  parameters: {
    mockingDate: { disable: true },
  },
  globals: {
    mockingDate: '2026-03-14T00:00:00Z',
  },
  play: async ({ canvas }) => {
    await expect(Math.abs(Date.now() - realNow())).toBeLessThan(60_000);
    await expect(canvas.getByRole('time')).not.toHaveTextContent('2026-03-14');
  },
});

// The clock is removed when a story ends. This story installs its own
// fake-timers clock, which fake-timers refuses ("Can't install fake timers
// twice on the same global object") if the previous story's clock were still
// there.
let ownClock: FakeTimers.Clock | undefined;

export const AnotherFakeClockCanFollowAMockedStory = meta.story({
  parameters: {
    mockingDate: { disable: true },
  },
  beforeEach: () => {
    ownClock = FakeTimers.install({
      toFake: ['Date'],
      now: new Date('1999-12-31T00:00:00Z'),
    });
    return () => {
      ownClock?.uninstall();
      ownClock = undefined;
    };
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent(
      '1999-12-31T00:00:00.000Z',
    );
  },
});
