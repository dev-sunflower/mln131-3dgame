'use client';

import { CoreComponentProps } from '../types';
import { BaseCoreVisual } from '../BaseCoreVisual';

// Thin wrapper - visual only, game logic handled by Room3
export function JusticeCore({
  config,
  status,
  onGameComplete,
  onHoverChange,
}: CoreComponentProps) {
  const handleClick = () => {
    if (status === 'locked') {
      onGameComplete(); // Signals Room3 to open mini-game
    }
  };

  return (
    <BaseCoreVisual
      config={config}
      status={status}
      onClick={handleClick}
      onHoverChange={onHoverChange}
    />
  );
}
