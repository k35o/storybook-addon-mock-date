---
"storybook-addon-mock-date": minor
---

Add opt-in faking of timers beyond `Date`, plus `play`-time clock controls.

The `mockingDate` parameter now accepts an object form alongside the existing scalar:

```ts
parameters: {
  mockingDate: {
    now: '2024-01-01T00:00:00',
    fake: ['Date', 'setTimeout', 'requestAnimationFrame', 'performance'],
  },
}
```

`fake` maps directly to [`@sinonjs/fake-timers`' `toFake`](https://github.com/sinonjs/fake-timers#var-clock--faketimersinstallconfig), so timer-driven UI — auto-dismissing toasts, debounced inputs, countdowns, count-ups, JS-driven animations — can be frozen for deterministic snapshots and visual regression tests, not just components that read `Date`. When `fake` is omitted it defaults to `['Date']`.

To reach a settled "after" state (a dismissed toast, a finished count-up, an elapsed countdown), three helpers are now exported from `storybook-addon-mock-date/preview` for use inside a story's `play` — advancing has to happen after mount, once the component has registered its timers:

- `advanceMockedTime(ms)` — advance the clock, running any timers scheduled within the window
- `runAllMockedTimers()` — drain every scheduled timer
- `getMockedClock()` — the raw clock, as an escape hatch

Fully backwards compatible: the scalar `mockingDate` (a `Date`, a millisecond timestamp, or an ISO string) and the toolbar override behave exactly as before and still fake only `Date`.
