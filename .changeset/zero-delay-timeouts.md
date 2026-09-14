---
'storybook-addon-mock-date': major
---

A zero-delay `setTimeout` now runs on the real timer even when `setTimeout` is faked; only timeouts of at least 1 ms wait for `advanceMockedTime` / `runAllMockedTimers`. user-event, and Testing Library under Storybook's React renderer, wait on a zero-delay timeout inside every interaction and query, so with `setTimeout` faked, `userEvent` calls and `findBy*` / `waitFor` queries in `play` never resolved — in the Storybook UI and under `@storybook/addon-vitest` alike. `Date` still reads the mocked instant inside the callback. Code that defers work with a zero-delay timeout now runs it as a real browser would instead of staying frozen until the clock is advanced.
