import type { Renderer, ProjectAnnotations } from "storybook/internal/types";
import { withMockTime } from "./withMockTime";

const preview: ProjectAnnotations<Renderer> = {
  decorators: [withMockTime],
};

export default preview;
