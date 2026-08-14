import { definePreview } from '@storybook/react-vite';
import mockDate from 'storybook-addon-mock-date';

export default definePreview({
  addons: [mockDate()],
  parameters: {
    mockingDate: new Date(2024, 0, 1),
  },
});
