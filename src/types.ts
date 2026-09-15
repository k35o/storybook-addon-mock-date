import type { FakeMethod } from '@sinonjs/fake-timers';

/**
 * Structural stand-in for `Temporal.Instant` / `Temporal.ZonedDateTime` —
 * anything carrying an `epochMilliseconds` number — so accepting Temporal
 * values does not require Temporal lib types (TypeScript does not ship them
 * yet).
 */
export type TemporalInstantLike = { epochMilliseconds: number };

/** A point in time accepted by the `mockingDate` parameter. */
export type MockingDateValue = Date | number | string | TemporalInstantLike;

/**
 * Timer / clock APIs that can be faked. Forwarded verbatim to
 * `@sinonjs/fake-timers`' `toFake` option (e.g. `'Date'`, `'setTimeout'`,
 * `'setInterval'`, `'requestAnimationFrame'`, `'performance'`).
 */
export type FakeableTimer = FakeMethod;

/**
 * The APIs that read the current time. They are faked by default and only
 * make sense together with a `now` to freeze at.
 */
export type ClockReader = Extract<FakeableTimer, 'Date' | 'Temporal' | 'Intl'>;

/**
 * The scheduling APIs (`setTimeout`, `setInterval`, `requestAnimationFrame`,
 * `performance`, …). Opt-in: faking them changes how a component behaves,
 * not just what time it sees.
 */
export type SchedulingApi = Exclude<FakeableTimer, ClockReader>;

/**
 * Object form of the `mockingDate` parameter. Three shapes:
 *
 * - `{ now, fake? }` freezes the clock at `now`. `fake` replaces the default
 *   `['Date', 'Temporal', 'Intl']` entirely, so list the clock readers you
 *   still want frozen next to any scheduling APIs.
 * - `{ fake: [...scheduling APIs] }` intercepts timers without a date: the
 *   clock readers stay real and the timers run on a clock that starts at the
 *   epoch. A `fake` array of clock readers alone would mock nothing, so it is
 *   rejected here.
 * - `{ disable }` opts a story out (or back in with `false`).
 */
export type MockingDateConfig =
  | {
      /** The instant to freeze the clock at. */
      now: MockingDateValue;
      /**
       * Which APIs to fake, forwarded to `@sinonjs/fake-timers`. Defaults to
       * the clock readers: `['Date', 'Temporal', 'Intl']`. An explicit array
       * replaces the default entirely.
       */
      fake?: FakeableTimer[];
      /** See {@link MockingDateConfig}. */
      disable?: boolean;
    }
  | {
      now?: undefined;
      /**
       * Scheduling APIs to intercept while the clock readers stay real. The
       * clock they run on starts at the epoch.
       */
      fake: SchedulingApi[];
      /** See {@link MockingDateConfig}. */
      disable?: boolean;
    }
  | {
      now?: undefined;
      fake?: undefined;
      /**
       * Run the story on the real clock, ignoring any `mockingDate` inherited
       * from the meta or preview level and any toolbar override. `false`
       * re-enables mocking inside a disabled meta.
       */
      disable: boolean;
    };

/**
 * The `mockingDate` parameter accepts either a bare date value (shorthand for
 * `{ now }` with the default `fake` set) or a configuration object.
 */
export type MockingDateParam = MockingDateValue | MockingDateConfig;

/**
 * Addon type declarations for CSF factories: registering the addon via
 * `definePreview({ addons: [mockDate()] })` types the `mockingDate`
 * parameter and global in `preview.meta()` / `meta.story()`.
 */
export type MockingDateTypes = {
  parameters: {
    /** Freeze the clock for the story. See {@link MockingDateParam}. */
    mockingDate?: MockingDateParam;
  };
  globals: {
    /**
     * Toolbar override: a date value that takes precedence over the
     * `mockingDate` parameter's `now` while leaving its `fake` set intact.
     */
    mockingDate?: MockingDateValue;
  };
};
