---
'storybook-addon-mock-date': major
---

The object form of `mockingDate`, the `play` helpers, and the toolbar are tidied up for 4.0.

- **The object form has three shapes**, and the type rejects everything else: `{ now, fake? }` freezes the clock at `now`; `{ fake: [...scheduling APIs] }` intercepts timers while the clock readers stay real; `{ disable }` opts a story out. `{ fake: ['Date'] }` without a `now` — which mocks nothing — is now a type error. The runtime is unchanged, so untyped CSF 3 stories behave as before. `ClockReader` and `SchedulingApi` are exported next to `FakeableTimer`.
- **`advanceMockedTime` and `runAllMockedTimers` return a promise** that resolves once the UI has committed and painted what the fired timers changed, so `await` them and assert on the next line — no more hand-written `requestAnimationFrame` flush after advancing the clock.
- **The helpers are exported from the package root only.** `storybook-addon-mock-date/preview` is the preview-annotations entry (`beforeEach`, `initialGlobals`); import `advanceMockedTime`, `runAllMockedTimers` and `getMockedClock` from `storybook-addon-mock-date`, where `mockDate()` comes from.
- The toolbar's **Reset to real time** button is now **Clear override**: it drops the toolbar date and falls back to the story's own `mockingDate`, which is what it always did. A story that should run on the real clock uses `mockingDate: { disable: true }`.
