'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useGameState } from '../../../hooks/useGameState';
import { useRoom3UI } from './useRoom3UI';
import { renderMiniGame } from './minigames';

// Exit button component - bottom left corner
// Resets Room 3 to initial state (shows "Start Game" button again)
function ExitButton() {
  const [mounted, setMounted] = useState(false);
  const resetGame = useRoom3UI((s) => s.resetGame);
  const gameStarted = useRoom3UI((s) => s.gameStarted);

  const handleExit = useCallback(() => {
    resetGame(); // Reset to show "Start Game" button again
  }, [resetGame]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gameStarted) {
        handleExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExit, gameStarted]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Only show exit button after game has started
  if (!mounted || !gameStarted) return null;

  return createPortal(
    <button
      onClick={handleExit}
      className="fixed bottom-4 left-4 z-50
                 flex items-center gap-2 px-3 py-2
                 bg-slate-800/80 hover:bg-slate-700/90
                 border border-slate-600 hover:border-slate-500
                 rounded-lg transition-all duration-200
                 text-slate-400 hover:text-slate-300
                 text-sm font-mono"
      title="Quay về màn hình bắt đầu Room 3 (ESC)"
    >
      <X className="w-4 h-4" />
      <span>Thoát</span>
    </button>,
    document.body
  );
}

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
      <ExitButton />
      <Tooltip />
      <GameOverlay />
    </>
  );
}
