import FakeTimers from '@sinonjs/fake-timers';
import type { PartialStoryFn, StoryContext } from 'storybook/internal/types';

const now = new Date();
let clock: FakeTimers.Clock | undefined;

export const withMockTime = (
  StoryFn: PartialStoryFn,
  context: StoryContext,
) => {
  const mockingDate = context.parameters['mockingDate'] as
    | Date
    | number
    | undefined;

  if (mockingDate === undefined) {
    if (clock) {
      clock.setSystemTime(now);
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
