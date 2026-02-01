'use client';

import { Html } from '@react-three/drei';
import { useGameState } from '../../../hooks/useGameState';
import { coreRegistry } from './cores';

export function CoreInventoryDisplay() {
  const { room3State } = useGameState();

  return (
    <Html position={[0, 3.5, 0]} center>
      <div className="font-display text-sm bg-black/80 px-4 py-2 rounded border border-brass-gold/30">
        <div className="text-brass-gold mb-1">Cores:</div>
        <div className="flex gap-2">
          {coreRegistry.map((entry) => {
            const { config } = entry;
            const coreState = room3State.cores[config.id];
            const status = coreState?.status || 'locked';

            const isUnlocked = status === 'unlocked';
            const isAssembled = status === 'assembled';

            return (
              <div
                key={config.id}
                className="text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: isAssembled
                    ? config.color + '40'
                    : isUnlocked
                    ? config.color + '20'
                    : '#333',
                  color: isAssembled || isUnlocked ? config.color : '#666',
                  border: `1px solid ${isAssembled ? config.color : '#444'}`,
                }}
              >
                {config.id.charAt(0).toUpperCase()}
                {isAssembled && ' ✓'}
              </div>
            );
          })}
        </div>
        {room3State.devicePowered && (
          <div className="mt-2 text-green-400 text-xs">✓ Device Powered!</div>
        )}
      </div>
    </Html>
  );
}
