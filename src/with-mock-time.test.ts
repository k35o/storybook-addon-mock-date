import { describe, expect, it } from 'vitest';

import { normalizeMockingDate } from './with-mock-time';

const DEFAULT_FAKE = ['Date', 'Temporal', 'Intl'];

describe('normalizeMockingDate', () => {
  it('treats a bare value as `now` with the default fake set', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    expect(normalizeMockingDate(date, undefined)).toEqual({
      disabled: false,
      now: date,
      fake: DEFAULT_FAKE,
    });
    expect(normalizeMockingDate(1_704_067_200_000, undefined)).toEqual({
      disabled: false,
      now: 1_704_067_200_000,
      fake: DEFAULT_FAKE,
    });
    expect(normalizeMockingDate('2024-01-01T00:00:00Z', undefined)).toEqual({
      disabled: false,
      now: new Date('2024-01-01T00:00:00Z'),
      fake: DEFAULT_FAKE,
    });
    expect(
      normalizeMockingDate({ epochMilliseconds: 1_704_067_200_000 }, undefined),
    ).toEqual({
      disabled: false,
      now: 1_704_067_200_000,
      fake: DEFAULT_FAKE,
    });
  });

  it('leaves `now` unset for a missing or unparsable value', () => {
    for (const value of [undefined, null, '', 'not a date', {}]) {
      expect(
        normalizeMockingDate(value as never, undefined),
        `value: ${JSON.stringify(value)}`,
      ).toEqual({
        disabled: false,
        now: undefined,
        fake: DEFAULT_FAKE,
      });
    }
  });

  it('lets the toolbar override `now` but not `fake`', () => {
    expect(
      normalizeMockingDate(
        { now: '2024-01-01T00:00:00Z', fake: ['Date', 'setTimeout'] },
        '2026-03-14T00:00:00Z',
      ),
    ).toEqual({
      disabled: false,
      now: new Date('2026-03-14T00:00:00Z'),
      fake: ['Date', 'setTimeout'],
    });
  });

  it('falls back to the default set for an empty `fake` array', () => {
    expect(normalizeMockingDate({ now: 0, fake: [] }, undefined)).toEqual({
      disabled: false,
      now: 0,
      fake: DEFAULT_FAKE,
    });
  });

  it('disables mocking when `disable` is true, even with a toolbar date', () => {
    expect(
      normalizeMockingDate(
        { now: '2024-01-01T00:00:00Z', disable: true },
        '2026-03-14T00:00:00Z',
      ),
    ).toEqual({ disabled: true });
  });

  it('keeps mocking when `disable` is false', () => {
    expect(normalizeMockingDate({ now: 0, disable: false }, undefined)).toEqual(
      { disabled: false, now: 0, fake: DEFAULT_FAKE },
    );
  });
});
