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

/** Object form of the `mockingDate` parameter. */
export type MockingDateConfig = {
  /**
   * The instant to freeze the clock at. When omitted (and the toolbar sets no
   * date), nothing is mocked unless `fake` lists a timer API — then the clock
   * starts at the epoch (`0`).
   */
  now?: MockingDateValue;
  /**
   * Which timer / clock APIs to fake. Defaults to the APIs that read the
   * current time: `['Date', 'Temporal', 'Intl']`. Add timer APIs
   * (`setTimeout`, `setInterval`, `requestAnimationFrame`, `performance`,
   * etc.) to intercept scheduling. An explicit array replaces the default
   * entirely, so list the clock readers you still want frozen alongside them.
   */
  fake?: FakeableTimer[];
  /**
   * Run the story on the real clock, ignoring any `mockingDate` inherited
   * from the meta or preview level and any toolbar override. Set it back to
   * `false` on a story to re-enable mocking inside a disabled meta.
   */
  disable?: boolean;
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
