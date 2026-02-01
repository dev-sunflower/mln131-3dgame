'use client';

import { useCallback } from 'react';
import { useGameState } from '../../../hooks/useGameState';
import { Room3Environment } from './Room3Environment';
import { Workbench } from './Workbench';
import { CoreInventoryDisplay } from './CoreInventoryDisplay';
import { coreRegistry } from './cores';
import { CoreStatus, HoverCallback } from './cores/types';
import { useRoom3UI, CoreId } from './useRoom3UI';

// Room 3 - 3D ONLY, no DOM elements
export function Room3() {
  const { room3State, assembleCore } = useGameState();
  // Use selectors to avoid re-render on tooltip state changes
  const openGame = useRoom3UI((s) => s.openGame);
  const setTooltip = useRoom3UI((s) => s.setTooltip);

  // Core clicked -> open mini-game via store
  const handleCoreClick = useCallback(
    (coreId: string) => {
      const coreState = room3State.cores[coreId];
      if (coreState?.status === 'locked') {
        openGame(coreId as CoreId);
      }
    },
    [room3State.cores, openGame]
  );

  // Slot clicked -> assemble unlocked core
  const handleSlotClick = useCallback(
    (coreId: string) => {
      const coreState = room3State.cores[coreId];
      if (coreState?.status === 'unlocked') {
        assembleCore(coreId);
      }
    },
    [room3State.cores, assembleCore]
  );

  // Hover handler factory
  const createHoverHandler = useCallback(
    (color: string): HoverCallback =>
      (hovered, label, position) => {
        setTooltip({ visible: hovered, label, position, color });
      },
    [setTooltip]
  );

  return (
    <group>
      <Room3Environment />
      <Workbench onSlotClick={handleSlotClick} />

      {coreRegistry.map((entry) => {
        const { id, config, Component } = entry;
        const coreState = room3State.cores[id];
        const status: CoreStatus = coreState?.status || 'locked';

        return (
          <Component
            key={id}
            config={config}
            status={status}
            onGameComplete={() => handleCoreClick(id)}
            onHoverChange={createHoverHandler(config.color)}
          />
        );
      })}

      <CoreInventoryDisplay />
    </group>
  );
}
