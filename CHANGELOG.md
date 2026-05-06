# v0.5.0 (Wed May 28 2025)

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
