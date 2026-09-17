import FakeTimers from '@sinonjs/fake-timers';
import type { BeforeEach } from 'storybook/internal/types';

import { GLOBAL_KEY, PARAM_KEY } from './constants';
import type {
  FakeableTimer,
  MockingDateConfig,
  MockingDateParam,
  MockingDateValue,
  TemporalInstantLike,
} from './types';

let clock: FakeTimers.Clock | undefined;
let installedFake: string | undefined;

const DEFAULT_FAKE: FakeableTimer[] = ['Date', 'Temporal', 'Intl'];

const isInstantLike = (value: unknown): value is TemporalInstantLike =>
  typeof value === 'object' &&
  value !== null &&
  'epochMilliseconds' in value &&
  typeof value.epochMilliseconds === 'number';

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
  if (isInstantLike(value)) {
    return value.epochMilliseconds;
  }
  return undefined;
};

// `now`/`fake` keys win over instant-likeness so that a (nonsensical) object
// carrying both `epochMilliseconds` and config keys keeps its `fake` set
// instead of silently dropping it. Real Temporal objects carry neither key.
const isConfig = (value: unknown): value is MockingDateConfig =>
  typeof value === 'object' &&
  value !== null &&
  !(value instanceof Date) &&
  ('now' in value || 'fake' in value || !isInstantLike(value));

type NormalizedMockingDate =
  | { disabled: true }
  | {
      disabled: false;
      now: Date | number | undefined;
      fake: FakeableTimer[];
    };

/**
 * Resolve the `mockingDate` parameter (scalar or object form) together with
 * the toolbar global into a normalized shape. The toolbar only ever carries a
 * date, so it overrides `now` while leaving `fake` untouched — that keeps a
 * story's `fake` set alive even when a date is picked interactively. A story
 * that opts out with `disable: true` stays out even while the toolbar holds a
 * date: it opted out because mocking breaks it, not because of the date.
 */
export const normalizeMockingDate = (
  param: MockingDateParam | undefined,
  globalValue: MockingDateValue | undefined,
): NormalizedMockingDate => {
  const config: MockingDateConfig = isConfig(param) ? param : { now: param };
  if (config.disable === true) {
    return { disabled: true };
  }
  const now = toDate(globalValue) ?? toDate(config.now);
  const fake =
    config.fake !== undefined && config.fake.length > 0
      ? config.fake
      : DEFAULT_FAKE;
  return { disabled: false, now, fake };
};

const fakeKeyOf = (fake: FakeableTimer[]): string => fake.toSorted().join(',');

// user-event, and Testing Library under Storybook's React renderer, wait on a
// zero-delay timeout inside every interaction and query, so a frozen one hangs
// `userEvent` and `findBy*` in `play`. Such a timeout is due at the mocked
// instant anyway, so it runs on the real timer and time stays frozen; only
// delays of at least 1 ms wait for the clock. `clock.uninstall()` restores the
// native `setTimeout`, which drops this wrapper along with the fake.
const runZeroDelayTimeoutsNatively = (
  nativeSetTimeout: typeof setTimeout,
): void => {
  const fakeSetTimeout = globalThis.setTimeout;
  globalThis.setTimeout = ((
    handler: TimerHandler,
    timeout?: number,
    ...args: unknown[]
  ) =>
    (timeout ?? 0) >= 1
      ? fakeSetTimeout(handler, timeout, ...args)
      : nativeSetTimeout(handler, timeout, ...args)) as typeof setTimeout;
};

const uninstallMockedClock = (): void => {
  if (clock) {
    clock.uninstall();
    clock = undefined;
    installedFake = undefined;
  }
};

// Without a date, the clock readers in the default set have no instant to
// freeze at; only a timer API needs a clock, which then starts at the epoch.
const needsClock = (
  normalized: NormalizedMockingDate,
): normalized is Extract<NormalizedMockingDate, { disabled: false }> =>
  !normalized.disabled &&
  (normalized.now !== undefined ||
    normalized.fake.some((method) => !DEFAULT_FAKE.includes(method)));

/**
 * Project-level `beforeEach`: installs the clock the story asks for and
 * returns the cleanup that removes it. Storybook runs project hooks before
 * component- and story-level ones, so the story's own `beforeEach` already
 * sees the mocked time, and runs the cleanup when it tears the story down, so
 * nothing leaks into the next story.
 */
export const installMockedClock: BeforeEach = (context) => {
  const normalized = normalizeMockingDate(
    context.parameters[PARAM_KEY] as MockingDateParam | undefined,
    context.globals[GLOBAL_KEY] as MockingDateValue | undefined,
  );

  if (!needsClock(normalized)) {
    uninstallMockedClock();
    return uninstallMockedClock;
  }
  const { now, fake } = normalized;

  // The hook runs again on every rerender of the same story (args or globals
  // changed) while the cleanup only runs at teardown, and stories on one docs
  // page install in turn, so a clock may already be there. `toFake` cannot be
  // changed on an installed clock: reinstall when the requested set differs.
  const nextKey = fakeKeyOf(fake);
  if (clock && installedFake !== nextKey) {
    uninstallMockedClock();
  }

  if (clock) {
    // Reset to the story's instant (epoch when omitted) so a reused clock is
    // as deterministic as a freshly installed one — never inheriting the
    // previous story's time.
    clock.setSystemTime(now ?? 0);
  } else {
    // `ignoreMissingTimers` keeps stories alive in environments that lack one
    // of the requested APIs (e.g. no native `Temporal` in Safari yet) —
    // fake-timers throws on absent globals otherwise.
    // `shouldClearNativeTimers` lets the faked `clearTimeout` cancel native
    // timers too: the ones Storybook armed before this clock existed (e.g. the
    // "preparing story" spinner) and the zero-delay timeouts routed below.
    const nativeSetTimeout = globalThis.setTimeout;
    clock = FakeTimers.install({
      toFake: fake,
      now: now ?? 0,
      ignoreMissingTimers: true,
      shouldClearNativeTimers: true,
    });
    if (fake.includes('setTimeout')) {
      runZeroDelayTimeoutsNatively(nativeSetTimeout);
    }
    installedFake = nextKey;
  }

  return uninstallMockedClock;
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

// Captured when the addon loads, before any story installs a clock, so the
// wait below stays real even in a story that fakes `requestAnimationFrame`.
// The DOM types declare it unconditionally, but portable stories can run
// where there is no frame to wait for.
const nativeRequestAnimationFrame = (
  globalThis as { requestAnimationFrame?: typeof requestAnimationFrame }
).requestAnimationFrame?.bind(globalThis);

// A timer that fires under `tick()` only queues the UI update it causes:
// React commits it in a task it posts through a MessageChannel. Posted
// messages share one task source, so a round-trip on a channel of our own
// runs after that commit; the animation frame afterwards lets the browser
// paint the result before a screenshot is taken.
const waitForCommit = async (): Promise<void> => {
  await new Promise<void>((resolve) => {
    const channel = new MessageChannel();
    channel.port1.addEventListener(
      'message',
      () => {
        channel.port1.close();
        resolve();
      },
      { once: true },
    );
    // Unlike assigning `onmessage`, `addEventListener` does not start the port.
    channel.port1.start();
    channel.port2.postMessage(undefined);
  });
  if (nativeRequestAnimationFrame) {
    await new Promise<void>((resolve) => {
      nativeRequestAnimationFrame(() => {
        resolve();
      });
    });
  }
};

/**
 * Advance the mocked clock by `ms` milliseconds, running any timers
 * (`setTimeout` / `setInterval` / `requestAnimationFrame` / …) scheduled
 * within that window, then wait for the UI to commit and paint what they
 * changed, so the next line of `play` can assert on it.
 *
 * Call this inside a story's `play` function — after the component has mounted
 * and registered its timers — to capture a settled "after" state. Ticking from
 * `beforeEach` would run before mount, when no component timer exists yet.
 */
export const advanceMockedTime = async (ms: number): Promise<void> => {
  requireClock('advanceMockedTime').tick(ms);
  await waitForCommit();
};

/**
 * Run every currently-scheduled timer until the queue drains, then wait for
 * the UI to commit and paint. Use inside `play` to fast-forward to the fully
 * settled state.
 */
export const runAllMockedTimers = async (): Promise<void> => {
  requireClock('runAllMockedTimers').runAll();
  await waitForCommit();
};

/**
 * Escape hatch: the installed `@sinonjs/fake-timers` clock (or `undefined`).
 *
 * Prefer `advanceMockedTime` / `runAllMockedTimers`. Mutating the returned
 * clock directly (`uninstall` / `reset` / `setSystemTime`) bypasses the
 * addon's internal tracking and can leave later stories in a broken state.
 */
export const getMockedClock = (): FakeTimers.Clock | undefined => clock;
