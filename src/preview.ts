import type { Renderer, ProjectAnnotations } from 'storybook/internal/types';

import { withMockTime } from './with-mock-time';

const preview: ProjectAnnotations<Renderer> = {
  decorators: [withMockTime],
};

export default preview;
