---
'storybook-addon-mock-date': patch
---

Ship root-level `preview.js` / `manager.js` shims so the addon resolves when
registered by absolute path.

Storybook resolves an addon entry such as
`getAbsolutePath('storybook-addon-mock-date')` as a filesystem path
(`<dir>/preview`, `<dir>/manager`), which bypasses the `package.json`
`exports` map. Because the package only exposed `./preview` and `./manager`
through `exports` and shipped no physical files at the package root, that
resolution failed and Storybook skipped the addon with
`Could not resolve addon ... skipping. Is it installed?`. The mocked `Date`
decorator was then never applied (notably under `@storybook/addon-vitest`).

Following the convention of the official addons (`@storybook/addon-a11y`
etc.), the package now ships root `preview.js` / `manager.js` re-export shims
pointing at `./dist`, so both the absolute-path form and the bare specifier
(`'storybook-addon-mock-date'`) resolve correctly.
