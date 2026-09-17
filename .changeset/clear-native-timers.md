---
'storybook-addon-mock-date': patch
---

Stories that fake `clearTimeout` no longer get stuck behind Storybook's loading spinner. Storybook arms its "preparing story" timer with the native `setTimeout` before the addon installs its clock and clears it once the story renders; the faked `clearTimeout` could not cancel that native timer, so it fired after the render and covered the story (seen when navigating to the story from the sidebar). The clock is now installed with `shouldClearNativeTimers`, which hands timers created before it to the native `clearTimeout`.
