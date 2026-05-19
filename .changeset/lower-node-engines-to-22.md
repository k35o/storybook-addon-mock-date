---
'storybook-addon-mock-date': patch
---

Lower the `engines.node` requirement back to `>=22.0.0` so consumers
running on the current Node.js maintenance LTS (22.x, supported until
April 2027) can install the addon without warnings.

This addon's published code is browser-only (Storybook preview and
manager bundles) and uses no Node.js APIs at runtime. Storybook 10
itself only requires Node 20+, so 22 is comfortably within range.
The repository's own development environment is still pinned to Node
24 via `mise.toml` and CI, which is independent of this constraint.
