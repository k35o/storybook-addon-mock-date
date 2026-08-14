import React from 'react';
import type { FC } from 'react';

// TypeScript ships no Temporal lib types yet, so reach the global
// structurally instead of relying on lib declarations.
type TemporalGlobal = {
  Now: { plainDateISO: () => { toString: () => string } };
};

export const CurrentTemporalDate: FC = () => {
  const temporal = (globalThis as { Temporal?: TemporalGlobal }).Temporal;
  if (!temporal) {
    return <p>Temporal is not available in this browser.</p>;
  }
  return <time>{temporal.Now.plainDateISO().toString()}</time>;
};
