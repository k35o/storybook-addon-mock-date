// Compile-only: `pnpm typecheck` proves which `mockingDate` shapes the type
// accepts and rejects. Nothing here runs.
import type { MockingDateParam } from './types';

export const accepted: MockingDateParam[] = [
  new Date(2024, 0, 1),
  1_704_067_200_000,
  '2024-01-01T00:00:00Z',
  { epochMilliseconds: 1_704_067_200_000 },
  { now: '2024-01-01T00:00:00Z' },
  { now: '2024-01-01T00:00:00Z', fake: ['Date', 'setTimeout'] },
  { now: 0, fake: ['setTimeout'] },
  { fake: ['setTimeout', 'clearTimeout'] },
  { fake: ['requestAnimationFrame', 'performance'], disable: false },
  { disable: true },
  { disable: false },
];

export const rejected: MockingDateParam[] = [
  // @ts-expect-error -- an empty object mocks nothing
  {},
  // @ts-expect-error -- clock readers need a `now` to freeze at
  { fake: ['Date'] },
  // @ts-expect-error -- so does any array that includes one
  { fake: ['setTimeout', 'Intl'] },
  // @ts-expect-error -- unknown fake-timers method
  { now: 0, fake: ['NotATimer'] },
  // @ts-expect-error -- a boolean is not a date value
  { now: true },
  // @ts-expect-error -- `disable` alone must be a boolean
  { disable: 'yes' },
];
