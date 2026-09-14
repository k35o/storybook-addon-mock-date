---
'storybook-addon-mock-date': major
---

`mockingDate` now freezes every API that reads the current time by default. When `fake` is omitted — the scalar form, the object form without `fake`, and the toolbar override — it defaults to `['Date', 'Temporal', 'Intl']` instead of `['Date']`, so `Temporal.Now` and zero-argument `Intl.DateTimeFormat#format` / `#formatToParts` return the mocked instant too. Scheduling APIs (`setTimeout`, `requestAnimationFrame`, …) stay opt-in.

- Components that render the current time through `Temporal.Now` or a zero-argument `Intl.DateTimeFormat#format` now show the mocked instant instead of the real time, so their visual snapshots change.
- While a story is mocked, `Intl.DateTimeFormat` is a wrapper from `@sinonjs/fake-timers`: a falsy date argument such as `0` formats the mocked instant instead of the epoch, formatters are not `instanceof Intl.DateTimeFormat`, subclasses lose their own methods, and `Intl` polyfills applied after the addon loads are not visible. Import polyfills above `storybook-addon-mock-date` in `.storybook/preview.ts`, or leave `'Intl'` out of `fake` for the stories that need the native formatter.
- An explicit `fake` array still replaces the default: `fake: ['Date']` restores the previous behaviour for a story, and a story that adds timers such as `['Date', 'setTimeout']` keeps `Temporal` and `Intl` on the real clock until you list them.
- Without `now`, a `fake` array of clock readers alone (`Date`, `Temporal`, `Intl`) no longer starts a clock at the epoch; the story runs on the real clock, as `{ fake: ['Date'] }` did before. Arrays that include a timer API still start the clock at the epoch.
