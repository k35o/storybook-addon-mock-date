import { defineConfig, type Options } from 'tsup';

type PackageJsonBundler = {
  bundler: {
    managerEntries: string[];
    previewEntries: string[];
  };
};

export default defineConfig(async () => {
  const packageJson = (
    await import('./package.json', { with: { type: 'json' } })
  ).default as PackageJsonBundler;

  const {
    bundler: { managerEntries, previewEntries },
  } = packageJson;

  const commonConfig: Options = {
    splitting: true,
    format: ['esm'],
    treeshake: true,
    // keep this line commented until https://github.com/egoist/tsup/issues/1270 is resolved
    // clean: options.watch ? false : true,
    clean: false,
    // The following packages are provided by Storybook and should always be externalized
    // Meaning they shouldn't be bundled with the addon, and they shouldn't be regular dependencies either
    external: ['react', 'react-dom', '@storybook/icons'],
  };

  const configs: Options[] = [];

  // manager entries are entries meant to be loaded into the manager UI
  // they'll have manager-specific packages externalized and they won't be usable in node
  // they won't have types generated for them as they're usually loaded automatically by Storybook
  if (managerEntries.length > 0) {
    configs.push({
      ...commonConfig,
      entry: managerEntries,
      platform: 'browser',
      target: 'esnext',
    });
  }

  // preview entries are entries meant to be loaded into the preview iframe
  // they'll have preview-specific packages externalized and they won't be usable in node
  // they'll have types generated for them so they can be imported when setting up Portable Stories
  if (previewEntries.length > 0) {
    configs.push({
      ...commonConfig,
      entry: previewEntries,
      target: 'esnext',
      platform: 'browser',
      dts: true,
    });
  }

  return configs;
});
