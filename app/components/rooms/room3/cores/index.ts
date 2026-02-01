import { CoreConfig, CoreRegistryEntry } from './types';
import { InnovationCore } from './innovation';
import { DigitalCore } from './digital';
import { JusticeCore } from './justice';

// Core configurations - defines appearance and positions
// Cores are now spread across the room for the mechanical machine design
export const coreConfigs: Record<string, CoreConfig> = {
  innovation: {
    id: 'innovation',
    label: 'Innovation Module',
    labelVi: 'Mô-đun Đổi mới',
    color: '#00d4ff',
    emissive: '#004466',
    // Far left of room, on machinery
    position: [-4.5, 1.8, 1],
    slotPosition: [-0.8, 0.5, 0],
    // Hexagonal prism shape
    shape: 'hexagon',
  },
  digital: {
    id: 'digital',
    label: 'Digital Core',
    labelVi: 'Lõi Kỹ thuật số',
    color: '#bd00ff',
    emissive: '#440066',
    // Far right of room, elevated
    position: [4.5, 2.2, -2],
    slotPosition: [0.8, 0.5, 0],
    // Cylindrical shape
    shape: 'cylinder',
  },
  justice: {
    id: 'justice',
    label: 'Justice Stabilizer',
    labelVi: 'Bộ cân bằng Công lý',
    color: '#ffd700',
    emissive: '#665500',
    // Back of room, high up
    position: [0, 3.8, -4.5],
    slotPosition: [0, 0.5, -0.8],
    // Floating crystal shard (tetrahedron)
    shape: 'crystal',
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
