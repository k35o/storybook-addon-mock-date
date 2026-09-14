import type { Renderer, ProjectAnnotations } from 'storybook/internal/types';

import { GLOBAL_KEY } from './constants';
import { withMockTime } from './with-mock-time';

// `storybook add` registers non-core addons as
// `import * as x from '<addon>/preview'`; exporting the annotations by name
// keeps that namespace assignable to `PreviewAddon`.
export const initialGlobals: ProjectAnnotations<Renderer>['initialGlobals'] = {
  [GLOBAL_KEY]: undefined,
};
export const decorators: ProjectAnnotations<Renderer>['decorators'] = [
  withMockTime,
];

const preview: ProjectAnnotations<Renderer> = { initialGlobals, decorators };

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
