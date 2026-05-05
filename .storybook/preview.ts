import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    mockingDate: new Date(2024, 0, 1),
  },
};

export default preview;
