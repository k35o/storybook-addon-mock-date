import React, { useEffect, useState } from 'react';
import type { FC } from 'react';

/**
 * A minimal auto-dismissing toast. It mounts visible and hides itself after
 * `duration` ms via `setTimeout` — exactly the kind of timer-driven UI that
 * races the screenshot in VRT unless `setTimeout` is faked.
 */
export const AutoDismissToast: FC<{ message: string; duration?: number }> = ({
  message,
  duration = 4000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => {
      clearTimeout(id);
    };
  }, [duration]);

  if (!visible) {
    return null;
  }
  return <output>{message}</output>;
};
