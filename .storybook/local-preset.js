/**
 * to load the built addon in this test Storybook
 */
export function previewAnnotations(entry = []) {
  return [...entry, new URL("../dist/preview.js", import.meta.url).pathname];
}

export function managerEntries(entry = []) {
  return [...entry, new URL("../dist/manager.js", import.meta.url).pathname];
}
