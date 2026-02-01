import { CoreConfig, CoreRegistryEntry } from './types';
import { InnovationCore } from './innovation';
import { DigitalCore } from './digital';
import { JusticeCore } from './justice';

// Core configurations - defines appearance and positions
export const coreConfigs: Record<string, CoreConfig> = {
  innovation: {
    id: 'innovation',
    label: 'Innovation Module',
    labelVi: 'Mô-đun Đổi mới',
    color: '#00d4ff',
    emissive: '#0088aa',
    position: [-3, 1.2, 0],
    slotPosition: [-0.3, 0.15, 0.15],
  },
  digital: {
    id: 'digital',
    label: 'Digital Core',
    labelVi: 'Lõi Kỹ thuật số',
    color: '#bd00ff',
    emissive: '#7700aa',
    position: [3, 0.8, -1],
    slotPosition: [0.3, 0.15, 0.15],
  },
  justice: {
    id: 'justice',
    label: 'Justice Stabilizer',
    labelVi: 'Bộ cân bằng Công lý',
    color: '#ffd700',
    emissive: '#aa8800',
    position: [0, 2, -2.5],
    slotPosition: [0, 0.15, -0.15],
  },
};

// Core registry - maps core IDs to their components
export const coreRegistry: CoreRegistryEntry[] = [
  {
    id: 'innovation',
    config: coreConfigs.innovation,
    Component: InnovationCore,
  },
  {
    id: 'digital',
    config: coreConfigs.digital,
    Component: DigitalCore,
  },
  {
    id: 'justice',
    config: coreConfigs.justice,
    Component: JusticeCore,
  },
];

// Export types for external use
export * from './types';
