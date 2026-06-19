import type { Renderer, ProjectAnnotations } from 'storybook/internal/types';

import { GLOBAL_KEY } from './constants';
import { withMockTime } from './with-mock-time';

const preview: ProjectAnnotations<Renderer> = {
  initialGlobals: {
    [GLOBAL_KEY]: undefined,
  },
  decorators: [withMockTime],
};

export default preview;

export {
  advanceMockedTime,
  getMockedClock,
  runAllMockedTimers,
} from './with-mock-time';
export type {
  FakeableTimer,
  MockingDateConfig,
  MockingDateParam,
  MockingDateValue,
} from './types';
