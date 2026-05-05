---
"storybook-addon-mock-date": major
---

Bump minimum Node.js requirement to `>=24.13.0` (was `>=22.0.0`) and update `packageManager` to `pnpm@10.33.2`.

Development environment is now pinned via `mise.toml`, and the pnpm workspace adds `blockExoticSubdeps` and `verifyDepsBeforeRun` for safer installs. CI workflows were consolidated behind a shared composite action and a new typecheck job runs on pull requests.
