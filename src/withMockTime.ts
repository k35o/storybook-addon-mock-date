import type {
  Renderer,
  PartialStoryFn,
  StoryContext,
} from "@storybook/types";
import FakeTimers from "@sinonjs/fake-timers";

const now = new Date();
let clock: FakeTimers.Clock | undefined;

export const withMockTime = (
  StoryFn: PartialStoryFn<Renderer>,
  context: StoryContext<Renderer>
) => {
  const mockingDate = context.parameters.mockingDate;

  if (!mockingDate) {
    if (clock) {
      clock.setSystemTime(now);
    }
    return StoryFn(context);
  }

  if (!clock) {
    clock = FakeTimers.install({
      toFake: ["Date"],
      ...(mockingDate && { now: mockingDate }),
    });
  } else {
    clock.setSystemTime(mockingDate);
  }

  return StoryFn(context);
}