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

// Start screen
function StartScreen() {
  const gameStarted = useRoom3UI((s) => s.gameStarted);
  const startGame = useRoom3UI((s) => s.startGame);
  const { language } = useGameState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || gameStarted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-cyan-900/90 to-black/90 border-2 border-cyan-600 rounded-lg p-8 max-w-2xl">
        <div className="text-6xl mb-4 text-center">🚀</div>
        <h1 className="text-4xl font-display text-cyan-500 mb-4 text-center">
          {language === 'en' ? 'Room 3: Innovation & Future' : 'Phòng 3: Đổi Mới & Tương Lai'}
        </h1>
        
        <div className="text-cyan-100 space-y-3 mb-6">
          <p>
            <strong className="text-cyan-400">{language === 'en' ? 'Mission:' : 'Nhiệm vụ:'}</strong><br/>
            {language === 'en' 
              ? 'Apply socialist principles to innovation, digital transformation, and social justice.'
              : 'Áp dụng nguyên lý xã hội chủ nghĩa vào đổi mới, chuyển đổi số và công bằng xã hội.'
            }
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-sm ml-4">
            <li><span className="text-green-400">Innovation Core</span> - {language === 'en' ? 'Startup spirit' : 'Tinh thần khởi nghiệp'}</li>
            <li><span className="text-blue-400">Digital Core</span> - {language === 'en' ? 'Digital transformation' : 'Chuyển đổi số'}</li>
            <li><span className="text-purple-400">Justice Core</span> - {language === 'en' ? 'Social justice' : 'Công bằng xã hội'}</li>
          </ul>
        </div>

        <button
          onClick={startGame}
          className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-display text-lg rounded transition-colors border border-cyan-400"
        >
          {language === 'en' ? 'Start' : 'Bắt Đầu'}
        </button>
      </div>
    </div>,
    document.body
  );
}

// Combined overlay - render outside Canvas
export function Room3Overlay() {
  return (
    <>
      <StartScreen />
      <ExitButton />
      <Tooltip />
      <GameOverlay />
    </>
  );
}
