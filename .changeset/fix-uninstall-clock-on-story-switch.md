---
'storybook-addon-mock-date': patch
---

Fix the mocked clock leaking into stories that have no `mockingDate`.

When switching from a story with `mockingDate` to a story where the
parameter is undefined (no story / meta / preview / global value), the
decorator used to call `clock.setSystemTime(now)` with a `now` captured
at module load. The fake `Date` stayed installed and froze at that
captured value, so subsequent `new Date()` calls returned a stale time
instead of the real one.

The decorator now calls `clock.uninstall()` and clears the cached
reference in that path, restoring the native `Date`.
