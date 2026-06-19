import FakeTimers from '@sinonjs/fake-timers';
import type { PartialStoryFn, StoryContext } from 'storybook/internal/types';

import { GLOBAL_KEY, PARAM_KEY } from './constants';
import type {
  FakeableTimer,
  MockingDateConfig,
  MockingDateParam,
  MockingDateValue,
} from './types';

let clock: FakeTimers.Clock | undefined;
let installedFake: string | undefined;

const DEFAULT_FAKE: FakeableTimer[] = ['Date'];

// Accepts `unknown` because Storybook parameters/globals are untyped at
// runtime — this gracefully ignores `null` and any non-date junk instead of
// crashing or installing a bogus clock.
const toDate = (value: unknown): Date | number | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }
  if (typeof value === 'number' || value instanceof Date) {
    return value;
  }
  return undefined;
};

const isConfig = (value: unknown): value is MockingDateConfig =>
  typeof value === 'object' && value !== null && !(value instanceof Date);

type NormalizedMockingDate = {
  now: Date | number | undefined;
  fake: FakeableTimer[];
};

/**
 * Resolve the `mockingDate` parameter (scalar or object form) together with
 * the toolbar global into a normalized `{ now, fake }`. The toolbar only ever
 * carries a date, so it overrides `now` while leaving `fake` untouched — that
 * keeps a story's `fake` set alive even when a date is picked interactively.
 */
export const normalizeMockingDate = (
  param: MockingDateParam | undefined,
  globalValue: MockingDateValue | undefined,
): NormalizedMockingDate => {
  const config: MockingDateConfig = isConfig(param) ? param : { now: param };
  const now = toDate(globalValue) ?? toDate(config.now);
  const fake =
    config.fake !== undefined && config.fake.length > 0
      ? config.fake
      : DEFAULT_FAKE;
  return { now, fake };
};

const isDefaultFake = (fake: FakeableTimer[]): boolean =>
  fake.length === 1 && fake[0] === 'Date';

const fakeKeyOf = (fake: FakeableTimer[]): string => fake.toSorted().join(',');

export const withMockTime = (
  StoryFn: PartialStoryFn,
  context: StoryContext,
) => {
  const { now, fake } = normalizeMockingDate(
    context.parameters[PARAM_KEY] as MockingDateParam | undefined,
    context.globals[GLOBAL_KEY] as MockingDateValue | undefined,
  );

  // Preserve the original behaviour: with no date and only the default
  // `['Date']` fake set there is nothing to mock.
  const shouldMock = now !== undefined || !isDefaultFake(fake);

  if (!shouldMock) {
    if (clock) {
      clock.uninstall();
      clock = undefined;
      installedFake = undefined;
    }
    // eslint-disable-next-line typescript/no-unsafe-return -- Storybook's PartialStoryFn return type is loosely typed
    return StoryFn(context);
  }

  const nextKey = fakeKeyOf(fake);
  // `toFake` cannot be changed on an already-installed clock, so reinstall
  // whenever the requested set differs from what is currently installed.
  if (clock && installedFake !== nextKey) {
    clock.uninstall();
    clock = undefined;
    installedFake = undefined;
  }

  if (clock) {
    // Reset to the story's instant (epoch when omitted) so a reused clock is
    // as deterministic as a freshly installed one — never inheriting the
    // previous story's time.
    clock.setSystemTime(now ?? 0);
  } else {
    clock = FakeTimers.install({ toFake: fake, now: now ?? 0 });
    installedFake = nextKey;
  }

  // eslint-disable-next-line typescript/no-unsafe-return -- Storybook's PartialStoryFn return type is loosely typed
  return StoryFn(context);
};

const requireClock = (method: string): FakeTimers.Clock => {
  if (!clock) {
    throw new Error(
      `[storybook-addon-mock-date] ${method}() was called without an installed clock. ` +
        'Set the `mockingDate` parameter (with `now` and/or `fake`) on the story first.',
    );
  }
  return clock;
};

/**
 * Advance the mocked clock by `ms` milliseconds, running any timers
 * (`setTimeout` / `setInterval` / `requestAnimationFrame` / …) scheduled
 * within that window.
 *
 * Call this inside a story's `play` function — after the component has mounted
 * and registered its timers — to capture a settled "after" state. Ticking from
 * a decorator would run before mount, when no component timer exists yet.
 *
 * Import it from `storybook-addon-mock-date/preview` — the same entry the
 * decorator ships from. Importing from any other path gives you a disconnected
 * clock instance and a "called without an installed clock" error.
 */
export const advanceMockedTime = (ms: number): void => {
  requireClock('advanceMockedTime').tick(ms);
};

/**
 * Run every currently-scheduled timer until the queue drains. Use inside
 * `play` to fast-forward to the fully settled state.
 */
export const runAllMockedTimers = (): void => {
  requireClock('runAllMockedTimers').runAll();
};

/**
 * Escape hatch: the installed `@sinonjs/fake-timers` clock (or `undefined`).
 *
 * Prefer `advanceMockedTime` / `runAllMockedTimers`. Mutating the returned
 * clock directly (`uninstall` / `reset` / `setSystemTime`) bypasses the
 * decorator's internal tracking and can leave later stories in a broken state.
 */
export const getMockedClock = (): FakeTimers.Clock | undefined => clock;
