import { TimeIcon } from '@storybook/icons';
import React, { memo, useCallback } from 'react';
import { ToggleButton, WithTooltip } from 'storybook/internal/components';
import { useGlobals } from 'storybook/manager-api';

import { GLOBAL_KEY } from './constants';

const pad = (n: number) => String(n).padStart(2, '0');

const formatForInput = (value: string | number | undefined): string => {
  if (value === undefined || value === '') {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const Picker = memo(function MockingDatePicker({
  value,
  onChange,
  onClear,
}: {
  value: string | number | undefined;
  onChange: (next: string) => void;
  onClear: () => void;
}) {
  return (
    <div
      style={{
        padding: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        minWidth: '14rem',
      }}
    >
      <label
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          fontSize: '0.75rem',
        }}
      >
        Mocked date
        <input
          type="datetime-local"
          aria-label="Mocked date"
          value={formatForInput(value)}
          onChange={(event) => {
            onChange(event.target.value);
          }}
        />
      </label>
      <button type="button" onClick={onClear}>
        Reset to real time
      </button>
    </div>
  );
});

export const Tool = memo(function MockingDateTool() {
  const [globals, updateGlobals] = useGlobals();
  const current = globals[GLOBAL_KEY] as string | number | undefined;

  const handleChange = useCallback(
    (next: string) => {
      if (next === '') {
        updateGlobals({ [GLOBAL_KEY]: undefined });
        return;
      }
      const parsed = new Date(next);
      if (Number.isNaN(parsed.getTime())) {
        return;
      }
      updateGlobals({ [GLOBAL_KEY]: parsed.toISOString() });
    },
    [updateGlobals],
  );

  const handleClear = useCallback(() => {
    updateGlobals({ [GLOBAL_KEY]: undefined });
  }, [updateGlobals]);

  return (
    <WithTooltip
      placement="bottom"
      trigger="click"
      closeOnOutsideClick
      tooltip={
        <Picker value={current} onChange={handleChange} onClear={handleClear} />
      }
    >
      <ToggleButton
        key={GLOBAL_KEY}
        ariaLabel="Override mocked date"
        variant="ghost"
        padding="small"
        pressed={current !== undefined}
      >
        <TimeIcon />
      </ToggleButton>
    </WithTooltip>
  );
});
