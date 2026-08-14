import { definePreviewAddon } from 'storybook/internal/csf';

import preview from './preview';
import type { MockingDateTypes } from './types';

export {
  advanceMockedTime,
  getMockedClock,
  runAllMockedTimers,
} from './with-mock-time';
export type {
  FakeableTimer,
  MockingDateConfig,
  MockingDateParam,
  MockingDateTypes,
  MockingDateValue,
} from './types';

const mockDate = () => definePreviewAddon<MockingDateTypes>(preview);

export default mockDate;
