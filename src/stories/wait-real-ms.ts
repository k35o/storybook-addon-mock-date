// Stories that fake setTimeout cannot wait on it, so wait on
// requestAnimationFrame, which stays real.
export const waitRealMs = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    const start = performance.now();
    const tick = () => {
      if (performance.now() - start >= ms) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
