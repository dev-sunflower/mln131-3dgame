'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Html } from '@react-three/drei';
import { X } from 'lucide-react';
import { useRoom2UI, CoreId } from './useRoom2UI';
import { useGameState } from '../../../hooks/useGameState';
import { EconomicBaseMiniGame } from './minigames/economic-base/EconomicBaseMiniGame';
import { SuperstructureMiniGame } from './minigames/superstructure/SuperstructureMiniGame';
import { ClassStruggleMiniGame } from './minigames/class-struggle/ClassStruggleMiniGame';
import { StatePowerMiniGame } from './minigames/state-power/StatePowerMiniGame';

// Exit button component
function ExitButton() {
  const [mounted, setMounted] = useState(false);
  const gameStarted = useRoom2UI((s) => s.gameStarted);
  const { setCurrentRoom } = useGameState();

  const handleExit = useCallback(() => {
    if (confirm('Bạn có muốn thoát Room 2? / Exit Room 2?')) {
      setCurrentRoom(0);
    }
  }, [setCurrentRoom]);

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

  if (!mounted || !gameStarted) return null;

  return createPortal(
    <button
      onClick={handleExit}
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-red-800/80 hover:bg-red-700/90 border border-red-600 hover:border-red-500 rounded-lg transition-all duration-200 text-red-200 hover:text-red-100 text-sm font-mono"
      title="Quay về Room 1 (ESC)"
    >
      <X className="w-4 h-4" />
      <span>Thoát</span>
    </button>,
    document.body
  );
}

// Start game screen
function StartScreen() {
  const gameStarted = useRoom2UI((s) => s.gameStarted);
  const startGame = useRoom2UI((s) => s.startGame);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || gameStarted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-red-900/90 to-black/90 border-2 border-red-600 rounded-lg p-8 max-w-2xl">
        <h1 className="text-4xl font-display text-red-500 mb-4 text-center">
          Phòng 2: Lý Thuyết Xã Hội Chủ Nghĩa
        </h1>
        <h2 className="text-2xl font-display text-red-400 mb-6 text-center">
          Room 2: Socialist Theory
        </h2>
        
        <div className="text-red-100 space-y-3 mb-6">
          <p>
            <strong className="text-red-400">Nhiệm vụ / Mission:</strong><br/>
            Khám phá và lắp ráp 4 Lõi Lý thuyết về Chủ nghĩa Xã hội và thời kỳ quá độ.
          </p>
          <p>
            Discover and assemble the 4 Cores of Socialist Theory and the transition period.
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-sm ml-4">
            <li><span className="text-amber-400">Kinh Tế Cơ Sở</span> - Economic Base</li>
            <li><span className="text-purple-400">Kiến Trúc Thượng Tầng</span> - Superstructure</li>
            <li><span className="text-red-400">Đấu Tranh Giai Cấp</span> - Class Struggle</li>
            <li><span className="text-cyan-400">Chính Quyền Nhà Nước</span> - State Power</li>
          </ul>

          <p className="text-sm italic mt-4">
            Click on each glowing core to unlock mini-games and learn about socialist principles!
          </p>
        </div>

        <button
          onClick={startGame}
          className="w-full px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-display text-lg rounded transition-colors border border-red-400"
        >
          Bắt Đầu / Start
        </button>
      </div>
    </div>,
    document.body
  );
}

// Tooltip component
function Tooltip() {
  const tooltip = useRoom2UI((s) => s.tooltip);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !tooltip.visible || !tooltip.position) return null;

  return null; // Tooltips are handled in 3D space via Html component
}

// Mini-game overlay
function GameOverlay() {
  const activeGame = useRoom2UI((s) => s.activeGame);
  const closeGame = useRoom2UI((s) => s.closeGame);
  const { unlockRoom2Core } = useGameState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !activeGame) return null;

  const handleComplete = () => {
    unlockRoom2Core(activeGame);
    closeGame();
  };

  const handleClose = () => {
    closeGame();
  };

  let GameComponent = null;
  switch (activeGame) {
    case 'economic-base':
      GameComponent = EconomicBaseMiniGame;
      break;
    case 'superstructure':
      GameComponent = SuperstructureMiniGame;
      break;
    case 'class-struggle':
      GameComponent = ClassStruggleMiniGame;
      break;
    case 'state-power':
      GameComponent = StatePowerMiniGame;
      break;
  }

  if (!GameComponent) return null;

  return createPortal(
    <GameComponent onComplete={handleComplete} onClose={handleClose} />,
    document.body
  );
}

export function Room2Overlay() {
  return (
    <>
      <StartScreen />
      <ExitButton />
      <Tooltip />
      <GameOverlay />
    </>
  );
}
