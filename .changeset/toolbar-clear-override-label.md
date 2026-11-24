---
'storybook-addon-mock-date': patch
---

The toolbar's **Reset to real time** button is now **Clear override**: it drops the toolbar date and falls back to the story's own `mockingDate`, which is what it always did. The story runs on the real clock only when it sets no `mockingDate`.
