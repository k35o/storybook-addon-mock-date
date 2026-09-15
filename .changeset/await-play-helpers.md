---
'storybook-addon-mock-date': major
---

`advanceMockedTime` and `runAllMockedTimers` return a promise that resolves once the UI has committed and painted what the fired timers changed, so `await` them and assert on the next line — no more hand-written `requestAnimationFrame` flush after advancing the clock.
