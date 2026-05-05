---
'storybook-addon-mock-date': minor
---

Add a toolbar override and accept ISO 8601 strings for `mockingDate`.

- A new clock icon in the Storybook toolbar opens a date/time picker
  that writes to a global `mockingDate` value. The decorator now
  honours `globals.mockingDate` first and falls back to
  `parameters.mockingDate`, so the toolbar can override any story
  without editing source.
- `parameters.mockingDate` and the toolbar both accept a `string` in
  addition to `Date` and `number`. Strings are parsed with
  `new Date(value)`, so anything `Date` understands works (e.g.
  `'2024-01-01'`, `'2024-01-01T00:00:00Z'`).

The `./manager` subpath export and the `dist/manager.js` bundle have
been re-introduced to host the toolbar entry point.
