import type {
  Renderer,
  PartialStoryFn,
  StoryContext,
} from "@storybook/types";
import FakeTimers from "@sinonjs/fake-timers";

let clock: FakeTimers.Clock | undefined;

export const withMockTime = (
  StoryFn: PartialStoryFn<Renderer>,
  context: StoryContext<Renderer>
) => {
  const mockingDate = context.parameters.mockingDate;

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