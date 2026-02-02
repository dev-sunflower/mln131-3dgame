'use client';

import { Html } from '@react-three/drei';
import { useGameState } from '../../../hooks/useGameState';
import { coreRegistry } from './cores';

export function CoreInventoryDisplay() {
  const { room2State } = useGameState();

  // Count unlocked cores
  const unlockedCount = Object.values(room2State.cores).filter(
    (core) => core.status === 'unlocked'
  ).length;

  if (unlockedCount === 0) return null;

  return (
    <Html position={[0, 4, 0]} center>
      <div className="bg-black/90 border border-red-500/50 rounded-lg px-4 py-2">
        <div className="text-red-400 font-display text-sm mb-2">
          Cores Mở Khóa / Unlocked Cores
        </div>
        <div className="flex gap-2">
          {coreRegistry.map((entry) => {
            const coreState = room2State.cores[entry.id];
            const status = coreState?.status || 'locked';

            if (status !== 'unlocked') return null;

            return (
              <div
                key={entry.id}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: entry.config.color,
                  backgroundColor: `${entry.config.color}20`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: entry.config.color }}
                />
              </div>
            );
          })}
        </div>
        <div className="text-white/60 text-xs mt-2">
          Click vào Workbench để lắp ráp / Click Workbench slots to assemble
        </div>
      </div>
    </Html>
  );
}
