import { addons } from 'storybook/manager-api';

import { ADDON_ID } from './constants';

addons.register(ADDON_ID, () => {
  // addons.add(TOOL_ID, {
  //   type: types.TOOL,
  //   title: "Mocking Date",
  //   match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
  //   render: Tool,
  // });
});
