---
'storybook-addon-mock-date': patch
---

Fix the addon catalog metadata so the package can be discovered and
categorised on storybook.js.org/addons.

- Reorder `keywords` so that `storybook-addon` is the first entry
  (the catalog requires this) and add `data-state` as the category
  keyword. Also include searchable terms (`mocking`, `date`, `time`,
  `fake-timers`).
- Drop `storybook.supportedFrameworks: ["supported-frameworks"]`,
  which was the literal placeholder string from the addon-kit
  template and confused the catalog parser. The decorator is
  renderer-agnostic, so omitting the field reflects reality.
- Replace the addon-kit placeholder GIF in `storybook.icon` with a
  custom clock icon committed at `.github/icon.png`.
- Tighten the package `description` from "Storybook addon to mocking
  date" to "Storybook addon that mocks the JavaScript Date for
  individual stories.".
