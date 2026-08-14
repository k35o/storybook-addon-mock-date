---
'storybook-addon-mock-date': minor
---

Add opt-in faking of `Temporal` and `Intl.DateTimeFormat`, and accept Temporal values as the mocked instant.

- `fake: ['Date', 'Temporal']` freezes the `Temporal.Now` namespace in browsers with native `Temporal` (Chrome/Edge 144+, Firefox 139+, Node.js 26+); `fake: ['Date', 'Intl']` routes zero-argument `Intl.DateTimeFormat#format` / `#formatToParts` — which read the system clock directly rather than going through `Date.now` — through the mocked clock.
- Requested APIs that don't exist in the environment (e.g. no native `Temporal` in Safari yet) are now skipped instead of throwing, so a story can list `'Temporal'` without breaking on browsers that lack it.
- `mockingDate` (and the object form's `now`) now also accepts a `Temporal.Instant` / `Temporal.ZonedDateTime` — any object carrying `epochMilliseconds`, exported as the `TemporalInstantLike` type.
- The redundant `@types/sinonjs__fake-timers` devDependency is gone; `@sinonjs/fake-timers` ships its own types, including `'Temporal'` and `'Intl'` in `FakeMethod`.

The default `fake` set is unchanged (`['Date']`) — fully backwards compatible.
