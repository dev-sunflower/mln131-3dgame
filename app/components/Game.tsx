'use client';

import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { Scene } from './Scene';
import { HUD } from './ui/HUD';
import { Inventory } from './ui/Inventory';
import { KnowledgeSidebar } from './ui/KnowledgeSidebar';
import { IntroScreen } from './ui/IntroScreen';
import { VictoryScreen } from './ui/VictoryScreen';
import { HintModal } from './ui/HintModal';
import { Room2Overlay } from './rooms/room2';
import { Room3Overlay } from './rooms/room3';
import { useGameState } from '../hooks/useGameState';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center z-50">
      <div className="text-center">
        <div className="loading-bar mx-auto mb-4">
          <div className="loading-bar-fill" style={{ width: '100%' }} />
        </div>
        <p className="text-brass-gold font-display text-sm tracking-widest">
          LOADING THE MYSTERIES...
        </p>
      </div>
    </div>
  );
}

export function Game() {
  const { showIntro, gameComplete, examineMode, currentRoom } = useGameState();

  // Lock pointer on click when not in examine mode
  useEffect(() => {
    const handleClick = () => {
      if (!examineMode && !showIntro && !gameComplete) {
        // Optional: lock pointer for immersion
        // document.body.requestPointerLock();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [examineMode, showIntro, gameComplete]);

  if (showIntro) {
    return <IntroScreen />;
  }

  if (gameComplete) {
    return <VictoryScreen />;
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0f]">
      {/* Vignette overlay */}
      <div className="vignette" />

      {/* Scan lines effect */}
      <div className="scan-lines" />

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ fov: 60, near: 0.1, far: 100, position: [0, 1.6, 4] }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#0a0a0f' }}
      >
        <Suspense fallback={null}>
          <Scene />
          <Preload all />
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      <HUD />
      <Inventory />
      <KnowledgeSidebar />
      <HintModal />
      {currentRoom === 1 && <Room2Overlay />}
      {currentRoom === 2 && <Room3Overlay />}

      {/* Crosshair */}
      {!examineMode && (
        <div className="crosshair" />
      )}
    </div>
  );
}
