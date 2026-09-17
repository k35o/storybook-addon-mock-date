---
'storybook-addon-mock-date': major
---

`advanceMockedTime` and `runAllMockedTimers` return a promise that resolves once the UI has committed and painted what the fired timers changed. `await` them to assert on the result on the next line without a hand-written `requestAnimationFrame` flush; a call without `await` still advances the clock right away, as in 3.x.
