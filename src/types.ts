import type { FakeMethod } from '@sinonjs/fake-timers';

/** A point in time accepted by the `mockingDate` parameter. */
export type MockingDateValue = Date | number | string;

/**
 * Timer / clock APIs that can be faked. Forwarded verbatim to
 * `@sinonjs/fake-timers`' `toFake` option (e.g. `'Date'`, `'setTimeout'`,
 * `'setInterval'`, `'requestAnimationFrame'`, `'performance'`).
 */
export type FakeableTimer = FakeMethod;

/** Object form of the `mockingDate` parameter. */
export type MockingDateConfig = {
  /** The instant to freeze the clock at. Defaults to the epoch (`0`). */
  now?: MockingDateValue;
  /**
   * Which timer / clock APIs to fake. Defaults to `['Date']`, matching the
   * historical behaviour. Expand it to also intercept `setTimeout`,
   * `setInterval`, `requestAnimationFrame`, `performance`, etc.
   */
  fake?: FakeableTimer[];
};

/**
 * The `mockingDate` parameter accepts either a bare date value (legacy form,
 * fakes only `Date`) or a configuration object.
 */
export type MockingDateParam = MockingDateValue | MockingDateConfig;
