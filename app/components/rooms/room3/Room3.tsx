'use client';

import { useCallback, useState } from 'react';
import { useGameState } from '../../../hooks/useGameState';
import { Room3Environment } from './Room3Environment';
import { Workbench } from './Workbench';
import { CoreInventoryDisplay } from './CoreInventoryDisplay';
import { coreRegistry } from './cores';
import { CoreStatus, HoverCallback } from './cores/types';
import { useRoom3UI, CoreId } from './useRoom3UI';
import DigitalPuzzleModal from './DigitalPuzzleModal';

// Room 3 - 3D ONLY, no DOM elements
export function Room3() {
  const { room3State, assembleCore } = useGameState();

  // ===== UI store =====
  const openGame = useRoom3UI((s) => s.openGame);
  const setTooltip = useRoom3UI((s) => s.setTooltip);

  // ===== LOCAL STATE for Digital Puzzle =====
  const [showDigitalPuzzle, setShowDigitalPuzzle] = useState(false);
  const [puzzleStep, setPuzzleStep] = useState(0);

  /**
   * Core clicked → open mini-game
   */
  const handleCoreClick = useCallback(
    (coreId: string) => {
      const coreState = room3State.cores[coreId];

      if (coreState?.status === 'locked') {
        // 👉 DIGITAL → mở puzzle modal
        if (coreId === 'digital') {
          setShowDigitalPuzzle(true);
          return;
        }

        // 👉 core khác → dùng flow cũ
        openGame(coreId as CoreId);
      }
    },
    [room3State.cores, openGame]
  );

  /**
   * Slot clicked → assemble unlocked core
   */
  const handleSlotClick = useCallback(
    (coreId: string) => {
      const coreState = room3State.cores[coreId];
      if (coreState?.status === 'unlocked') {
        assembleCore(coreId);
      }
    },
    [room3State.cores, assembleCore]
  );

  /**
   * Hover handler factory
   */
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

      {/* ===== DIGITAL PUZZLE MODAL ===== */}
      {showDigitalPuzzle && (
  <DigitalPuzzleModal
    step={puzzleStep}
    setStep={() => setPuzzleStep((s) => s + 1)}

    // ✅ ĐÓNG MODAL → KHÔNG RESET STEP
    onClose={() => {
      setShowDigitalPuzzle(false);
    }}

    // ✅ CHỈ RESET KHI HOÀN THÀNH
    onSuccess={() => {
      assembleCore("digital");
      setShowDigitalPuzzle(false);
      setPuzzleStep(0); // ✅ reset DUY NHẤT ở đây
    }}
  />
)}

    </group>
  );
}
