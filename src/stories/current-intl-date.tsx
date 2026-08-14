import React from 'react';
import type { FC } from 'react';

export const CurrentIntlDate: FC = () => {
  // Zero-arg `format()` reads the system clock directly (not through
  // `Date.now`), which is exactly the leak the default `Intl` fake plugs.
  // UTC output keeps assertions timezone-independent.
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    dateStyle: 'long',
    timeZone: 'UTC',
  });
  return <time>{formatter.format()}</time>;
};
