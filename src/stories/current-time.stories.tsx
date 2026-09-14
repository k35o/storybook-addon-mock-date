import { expect } from 'storybook/test';

import preview from '../../.storybook/preview';
import { CurrentTime } from './current-time';

const metaDate = new Date(2023, 0, 1);
const storyDate = new Date(2023, 6, 1);

const meta = preview.meta({
  component: CurrentTime,
  parameters: {
    mockingDate: metaDate,
  },
});

export const AddParametersAtStory = meta.story({
  parameters: {
    mockingDate: storyDate,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent(
      storyDate.toISOString(),
    );
  },
});

export const AddParametersAtMeta = meta.story({
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('time')).toHaveTextContent(
      metaDate.toISOString(),
    );
  },
});
