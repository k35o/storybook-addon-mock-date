# v0.5.0 (Wed May 28 2025)

## 3.1.0

### Minor Changes

- [#88](https://github.com/k35o/storybook-addon-mock-date/pull/88) [`d61c7ce`](https://github.com/k35o/storybook-addon-mock-date/commit/d61c7ce1d605919a03e07c3406b875c5ba6a3c53) Thanks [@k35o](https://github.com/k35o)! - Add opt-in faking of timers beyond `Date`, plus `play`-time clock controls.

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

## 3.0.3

### Patch Changes

- [#82](https://github.com/k35o/storybook-addon-mock-date/pull/82) [`645e2b4`](https://github.com/k35o/storybook-addon-mock-date/commit/645e2b460cde024cac5634c38dc2de5161794ce8) Thanks [@k35o](https://github.com/k35o)! - Ship root-level `preview.js` / `manager.js` shims so the addon resolves when
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

## 3.0.2

### Patch Changes

- [#55](https://github.com/k35o/storybook-addon-mock-date/pull/55) [`347cdb7`](https://github.com/k35o/storybook-addon-mock-date/commit/347cdb7798ae36eb6d5410010caa238b64b5b2f0) Thanks [@k35o](https://github.com/k35o)! - Fix the mocked clock leaking into stories that have no `mockingDate`.

  When switching from a story with `mockingDate` to a story where the
  parameter is undefined (no story / meta / preview / global value), the
  decorator used to call `clock.setSystemTime(now)` with a `now` captured
  at module load. The fake `Date` stayed installed and froze at that
  captured value, so subsequent `new Date()` calls returned a stale time
  instead of the real one.

  The decorator now calls `clock.uninstall()` and clears the cached
  reference in that path, restoring the native `Date`.

- [#57](https://github.com/k35o/storybook-addon-mock-date/pull/57) [`8cd84c0`](https://github.com/k35o/storybook-addon-mock-date/commit/8cd84c098e5a06a4c6fd7b4dbb86ca2799b4ce57) Thanks [@k35o](https://github.com/k35o)! - Lower the `engines.node` requirement back to `>=22.0.0` so consumers
  running on the current Node.js maintenance LTS (22.x, supported until
  April 2027) can install the addon without warnings.

  This addon's published code is browser-only (Storybook preview and
  manager bundles) and uses no Node.js APIs at runtime. Storybook 10
  itself only requires Node 20+, so 22 is comfortably within range.
  The repository's own development environment is still pinned to Node
  24 via `mise.toml` and CI, which is independent of this constraint.

## 3.0.1

### Patch Changes

- [#47](https://github.com/k35o/storybook-addon-mock-date/pull/47) [`e84f2e1`](https://github.com/k35o/storybook-addon-mock-date/commit/e84f2e114a0954567fb5469dca8948a0b83eca04) Thanks [@k35o](https://github.com/k35o)! - Fix the addon catalog metadata so the package can be discovered and
  categorised on storybook.js.org/addons.

  - Reorder `keywords` so that `storybook-addon` is the first entry
    (the catalog requires this) and add `data-state` as the category
    keyword. Also include searchable terms (`mocking`, `date`, `time`,
    `fake-timers`).
  - Drop `storybook.supportedFrameworks: ["supported-frameworks"]`,
    which was the literal placeholder string from the addon-kit
    template and confused the catalog parser. The decorator is
    renderer-agnostic, so omitting the field reflects reality.
  - Replace the addon-kit placeholder GIF in `storybook.icon` with a
    custom clock icon committed at `.github/icon.png`.
  - Tighten the package `description` from "Storybook addon to mocking
    date" to "Storybook addon that mocks the JavaScript Date for
    individual stories.".

## 3.0.0

### Major Changes

- [#44](https://github.com/k35o/storybook-addon-mock-date/pull/44) [`f1af2d7`](https://github.com/k35o/storybook-addon-mock-date/commit/f1af2d7a76d216e134d72da1789a59431a888153) Thanks [@k35o](https://github.com/k35o)! - Switch the bundler from `tsup` to `vp pack` (powered by `tsdown`) and bump
  `@vitejs/plugin-react` to 6.0.1 with `vite` 8.0.10. The published bundle
  output keeps the same shape (`dist/preview.js` + `dist/preview.d.ts`).

  `@sinonjs/fake-timers` is now declared in `dependencies` and externalized
  from the bundle, so consumers receive upstream patches directly and the
  addon ships ~140 kB lighter.

  The previously broken `"."` export entry (which pointed at a `dist/index.js`
  that the build never emitted) has been removed from `package.json`.

- [#44](https://github.com/k35o/storybook-addon-mock-date/pull/44) [`f1af2d7`](https://github.com/k35o/storybook-addon-mock-date/commit/f1af2d7a76d216e134d72da1789a59431a888153) Thanks [@k35o](https://github.com/k35o)! - Drop the legacy manager surface and addon-kit scaffolding leftovers.

  - The `./manager` subpath export and the `dist/manager.js` bundle have
    been removed. The previous manager entry only registered the addon
    with an empty callback (`addons.register(ADDON_ID, () => {})`), so it
    never contributed any UI or behaviour. Storybook 10's addon loader
    resolves `<name>/manager` via the package's `exports` map and
    gracefully no-ops when that export is missing, which matches the
    `peerDependencies.storybook: ^10.0.0` range this addon already
    declares.
  - The root `manager.js` and `preview.js` bridge files have also been
    removed. Storybook 10 reads the `./preview` entry from `exports`
    directly and no longer needs the legacy root bridges.

- [#35](https://github.com/k35o/storybook-addon-mock-date/pull/35) [`d6a7176`](https://github.com/k35o/storybook-addon-mock-date/commit/d6a7176017668390a8b375dda85c07966a8c2a71) Thanks [@k35o](https://github.com/k35o)! - Bump minimum Node.js requirement to `>=24.13.0` (was `>=22.0.0`) and update `packageManager` to `pnpm@10.33.2`.

  Development environment is now pinned via `mise.toml`, and the pnpm workspace adds `blockExoticSubdeps` and `verifyDepsBeforeRun` for safer installs. CI workflows were consolidated behind a shared composite action and a new typecheck job runs on pull requests.

### Minor Changes

- [#46](https://github.com/k35o/storybook-addon-mock-date/pull/46) [`e74cbe9`](https://github.com/k35o/storybook-addon-mock-date/commit/e74cbe9d01c4912d909d65a503ee6fdfe871b8d0) Thanks [@k35o](https://github.com/k35o)! - Add a toolbar override and accept ISO 8601 strings for `mockingDate`.

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

  If you want the date mocking without the toolbar icon, you can opt into
  "decorator-only" mode by importing the preview entry directly from
  `.storybook/preview.ts` and leaving `'storybook-addon-mock-date'` out of
  your `.storybook/main.ts` `addons` list. The README's "Disabling the
  toolbar" section walks through the snippet.

## 2.0.0

### Major Changes

- [#31](https://github.com/k35o/storybook-addon-mock-date/pull/31) [`d50dc60`](https://github.com/k35o/storybook-addon-mock-date/commit/d50dc60a6e5fad20c18abc2e8b68fa5dc525fab8) Thanks [@k35o](https://github.com/k35o)! - Migrate to Storybook 10 (next version)
  - Update Storybook packages to next version
  - Modernize build configuration with ESM-only output
  - Remove unused addons (addon-links, addon-icons)
  - Update peerDependencies to require Storybook ^10.0.0
  - Simplify package exports and build configuration
  - Migrate configuration files to TypeScript

### Patch Changes

- [#29](https://github.com/k35o/storybook-addon-mock-date/pull/29) [`4a35629`](https://github.com/k35o/storybook-addon-mock-date/commit/4a3562916ed8f04d7d7c126864ffc85d3017c543) Thanks [@k35o](https://github.com/k35o)! - Migrate package manager from npm to pnpm for improved dependency management

- [#32](https://github.com/k35o/storybook-addon-mock-date/pull/32) [`1d6257c`](https://github.com/k35o/storybook-addon-mock-date/commit/1d6257cbbafd81cbe6b851ae341ce30c1a9c3a93) Thanks [@k35o](https://github.com/k35o)! - Relax Node.js version requirement from 24.4.1 to >=22.0.0 for better compatibility

## 1.0.2

### Patch Changes

- [#26](https://github.com/k35o/storybook-addon-mock-date/pull/26) [`55d3fe1`](https://github.com/k35o/storybook-addon-mock-date/commit/55d3fe159bc92a731dfe31fad2bcae1ebbf04ec3) Thanks [@k35o](https://github.com/k35o)! - Migrate to npm OIDC authentication for secure publishing

## 1.0.1

### Patch Changes

- [#23](https://github.com/k35o/storybook-addon-mock-date/pull/23) [`5696b1b`](https://github.com/k35o/storybook-addon-mock-date/commit/5696b1b855ac2316adbe470b30e86f648898b3f5) Thanks [@KuSh](https://github.com/KuSh)! - Move util to dev dependencies

- [#24](https://github.com/k35o/storybook-addon-mock-date/pull/24) [`30853cc`](https://github.com/k35o/storybook-addon-mock-date/commit/30853cc2c2fb356912c02919cf0588da79fe13a0) Thanks [@KuSh](https://github.com/KuSh)! - Upgrade to stable storybook 9

## 1.0.0

### Major Changes

- [#20](https://github.com/k35o/storybook-addon-mock-date/pull/20) [`f399c4e`](https://github.com/k35o/storybook-addon-mock-date/commit/f399c4e53c3bdbf07efd2a0a3ebc01f3872c0d71) Thanks [@k35o](https://github.com/k35o)! - Major Release

#### 🚀 Enhancement

- feat: Port addon to Storybook 9 [#11](https://github.com/k35o/storybook-addon-mock-date/pull/11) ([@Sidnioulz](https://github.com/Sidnioulz) [@k35o](https://github.com/k35o))
- consider situations where mockingdate is not set [#7](https://github.com/k35o/storybook-addon-mock-date/pull/7) ([@k35o](https://github.com/k35o))

#### 🐛 Bug Fix

- update vesion [#14](https://github.com/k35o/storybook-addon-mock-date/pull/14) ([@k35o](https://github.com/k35o))
- empty [#9](https://github.com/k35o/storybook-addon-mock-date/pull/9) ([@k35o](https://github.com/k35o))
- add write contents persissions [#8](https://github.com/k35o/storybook-addon-mock-date/pull/8) ([@k35o](https://github.com/k35o))
- Update README.md [#5](https://github.com/k35o/storybook-addon-mock-date/pull/5) ([@alexwalpole](https://github.com/alexwalpole) [@k35o](https://github.com/k35o))

#### ⚠️ Pushed to `main`

- add contetns write permissions ([@k35o](https://github.com/k35o))
- node version by package.json ([@k35o](https://github.com/k35o))
- ndoe 22 ([@k35o](https://github.com/k35o))

#### Authors: 3

- Alex Walpole ([@alexwalpole](https://github.com/alexwalpole))
- k8o ([@k35o](https://github.com/k35o))
- Steve Dodier-Lazaro ([@Sidnioulz](https://github.com/Sidnioulz))

---

# v0.4.1 (Wed Apr 03 2024)

#### 🐛 Bug Fix

- patch [#3](https://github.com/k35o/storybook-addon-mock-date/pull/3) ([@k35o](https://github.com/k35o))
- patch [#2](https://github.com/k35o/storybook-addon-mock-date/pull/2) ([@k35o](https://github.com/k35o))

#### Authors: 1

- k8o ([@k35o](https://github.com/k35o))

---

# v0.4.0 (Wed Apr 03 2024)

#### 🚀 Enhancement

- v0.1.0 [#1](https://github.com/k35o/storybook-addon-mock-date/pull/1) ([@k35o](https://github.com/k35o))

#### ⚠️ Pushed to `main`

- update readme ([@k35o](https://github.com/k35o))
- comment out Tool ([@k35o](https://github.com/k35o))
- mock date by parameters ([@k35o](https://github.com/k35o))
- remove extra file ([@k35o](https://github.com/k35o))
- remove initial stories ([@k35o](https://github.com/k35o))
- add @storybook/icons to dev deps ([@k35o](https://github.com/k35o))
- regenerate package-lock.json ([@k35o](https://github.com/k35o))
- project setup ([@k35o](https://github.com/k35o))
- Initial commit ([@k35o](https://github.com/k35o))

#### Authors: 1

- k8o ([@k35o](https://github.com/k35o))
