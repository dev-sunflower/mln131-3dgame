'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useGameState } from '../../../hooks/useGameState';
import { useRoom3UI } from './useRoom3UI';
import { renderMiniGame } from './minigames';

// Tooltip component
function Tooltip() {
  const { tooltip } = useRoom3UI();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !tooltip.visible) return null;

  return createPortal(
    <div
      className="fixed pointer-events-none text-xs font-display whitespace-nowrap bg-black/80 px-2 py-1 rounded z-40"
      style={{
        left: tooltip.position.x,
        top: tooltip.position.y,
        transform: 'translate(-50%, -100%)',
        color: tooltip.color,
      }}
    >
      {tooltip.label}
    </div>,
    document.body
  );
}

// Mini-game overlay
function GameOverlay() {
  const { activeCoreId, closeGame } = useRoom3UI();
  const { unlockCore } = useGameState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !activeCoreId) return null;

  const handleComplete = () => {
    unlockCore(activeCoreId);
    closeGame();
  };

  return createPortal(
    <>{renderMiniGame(activeCoreId, handleComplete, closeGame)}</>,
    document.body
  );
}

// Combined overlay - render outside Canvas
export function Room3Overlay() {
  return (
    <>
      <Tooltip />
      <GameOverlay />
    </>
  );
}
