---
'storybook-addon-mock-date': major
---

Switch the bundler from `tsup` to `vp pack` (powered by `tsdown`) and bump
`@vitejs/plugin-react` to 6.0.1 with `vite` 8.0.10. The published bundle
output keeps the same shape (`dist/preview.js` + `dist/preview.d.ts`).

`@sinonjs/fake-timers` is now declared in `dependencies` and externalized
from the bundle, so consumers receive upstream patches directly and the
addon ships ~140 kB lighter.

The previously broken `"."` export entry (which pointed at a `dist/index.js`
that the build never emitted) has been removed from `package.json`.
