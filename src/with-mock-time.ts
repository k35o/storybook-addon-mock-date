import FakeTimers from '@sinonjs/fake-timers';
import type { PartialStoryFn, StoryContext } from 'storybook/internal/types';

import { GLOBAL_KEY, PARAM_KEY } from './constants';

let clock: FakeTimers.Clock | undefined;

const toDate = (
  value: Date | number | string | undefined,
): Date | number | undefined => {
  if (value === undefined || value === '') {
    return undefined;
  }
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }
  return value;
};

export const withMockTime = (
  StoryFn: PartialStoryFn,
  context: StoryContext,
) => {
  const fromGlobal = context.globals[GLOBAL_KEY] as
    | Date
    | number
    | string
    | undefined;
  const fromParameter = context.parameters[PARAM_KEY] as
    | Date
    | number
    | string
    | undefined;

  const mockingDate = toDate(fromGlobal) ?? toDate(fromParameter);

  if (mockingDate === undefined) {
    if (clock) {
      clock.uninstall();
      clock = undefined;
    }
    // eslint-disable-next-line typescript/no-unsafe-return -- Storybook's PartialStoryFn return type is loosely typed
    return StoryFn(context);
  }

  if (clock) {
    clock.setSystemTime(mockingDate);
  } else {
    clock = FakeTimers.install({
      toFake: ['Date'],
      now: mockingDate,
    });
  }

  // eslint-disable-next-line typescript/no-unsafe-return -- Storybook's PartialStoryFn return type is loosely typed
  return StoryFn(context);
};
