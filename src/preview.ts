import type { Renderer, ProjectAnnotations } from 'storybook/internal/types';

import { GLOBAL_KEY } from './constants';
import { installMockedClock } from './with-mock-time';

// `storybook add` registers non-core addons as
// `import * as x from '<addon>/preview'`; exporting the annotations by name
// keeps that namespace assignable to `PreviewAddon`.
export const initialGlobals: ProjectAnnotations<Renderer>['initialGlobals'] = {
  [GLOBAL_KEY]: undefined,
};
export const beforeEach: ProjectAnnotations<Renderer>['beforeEach'] = [
  installMockedClock,
];

const preview: ProjectAnnotations<Renderer> = { initialGlobals, beforeEach };

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
  TemporalInstantLike,
} from './types';
