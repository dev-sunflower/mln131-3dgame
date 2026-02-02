'use client';

import { useCallback } from 'react';
import { useGameState } from '../../../hooks/useGameState';
import { Room2Environment } from './Room2Environment';
import { Workbench } from './Workbench';
import { CoreInventoryDisplay } from './CoreInventoryDisplay';
import { coreRegistry } from './cores';
import { CoreStatus, HoverCallback } from './cores/types';
import { useRoom2UI, CoreId } from './useRoom2UI';

export function Room2() {
  const { room2State, assembleCore } = useGameState();

  const openGame = useRoom2UI((s) => s.openGame);
  const setTooltip = useRoom2UI((s) => s.setTooltip);
  const gameStarted = useRoom2UI((s) => s.gameStarted);

  const handleCoreClick = useCallback(
    (coreId: string) => {
      if (!gameStarted) return;

      const coreState = room2State.cores[coreId];

      if (coreState?.status === 'locked') {
        openGame(coreId as CoreId);
      }
    },
    [room2State.cores, openGame, gameStarted]
  );

  const handleSlotClick = useCallback(
    (coreId: string) => {
      const coreState = room2State.cores[coreId];
      if (coreState?.status === 'unlocked') {
        assembleCore(coreId);
      }
    },
    [room2State.cores, assembleCore]
  );

  const createHoverHandler = useCallback(
    (color: string): HoverCallback =>
      (hovered, label, position) => {
        setTooltip({ visible: hovered, label, position, color });
      },
    [setTooltip]
  );

  return (
    <group>
      <Room2Environment />
      <Workbench onSlotClick={handleSlotClick} />

      {coreRegistry.map((entry) => {
        const { id, config, Component } = entry;
        const coreState = room2State.cores[id];
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
