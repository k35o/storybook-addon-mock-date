---
'storybook-addon-mock-date': major
---

Drop the legacy manager surface and addon-kit scaffolding leftovers.

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
