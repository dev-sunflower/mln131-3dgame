'use client';

import { Html } from '@react-three/drei';
import { useGameState } from '../../../hooks/useGameState';
import { coreRegistry } from './cores';
import { useRoom3UI } from './useRoom3UI';

export function CoreInventoryDisplay() {
  const { room3State } = useGameState();
  const gameStarted = useRoom3UI((s) => s.gameStarted);

  return (
    <Html position={[0, 5, -3]} center>
      <div
        className="font-mono text-sm px-4 py-3 rounded-lg"
        style={{
          backgroundColor: 'rgba(10, 10, 20, 0.85)',
          border: '1px solid rgba(60, 60, 80, 0.4)',
        }}
      >
        {/* Core indicators only */}
        <div className="flex gap-3">
          {coreRegistry.map((entry) => {
            const { config } = entry;
            const coreState = room3State.cores[config.id];
            const status = coreState?.status || 'locked';

            const isUnlocked = status === 'unlocked';
            const isAssembled = status === 'assembled';

            // Shape indicator
            const shapeIcon = config.shape === 'hexagon' ? '⬡'
              : config.shape === 'cylinder' ? '◯'
              : config.shape === 'crystal' ? '◇'
              : '◆';

            return (
              <div
                key={config.id}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="w-9 h-9 flex items-center justify-center rounded text-lg"
                  style={{
                    backgroundColor: isAssembled
                      ? config.color + '30'
                      : isUnlocked
                        ? config.color + '15'
                        : 'rgba(30, 30, 40, 0.8)',
                    color: isAssembled
                      ? config.color
                      : isUnlocked
                        ? config.color
                        : '#444',
                    border: `1px solid ${isAssembled ? config.color : isUnlocked ? config.color + '60' : '#333'}`,
                    boxShadow: isAssembled ? `0 0 10px ${config.color}50` : 'none',
                  }}
                >
                  {shapeIcon}
                </div>
                <span
                  className="text-[8px] uppercase tracking-wide"
                  style={{
                    color: isAssembled ? config.color : isUnlocked ? config.color : '#555',
                  }}
                >
                  {isAssembled ? '✓' : isUnlocked ? 'READY' : '●'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Html>
  );
}
