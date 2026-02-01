// Core status represents the progression of each core
export type CoreStatus = 'locked' | 'unlocked' | 'assembled';

// Shape types for different core visuals
export type CoreShape = 'hexagon' | 'cylinder' | 'crystal' | 'octahedron';

// Configuration for each core's appearance and position
export interface CoreConfig {
  id: string;
  label: string;
  labelVi: string;
  color: string;
  emissive: string;
  position: [number, number, number];
  slotPosition: [number, number, number];
  shape?: CoreShape; // Different visual shapes for each core
}

// Hover callback for tooltip positioning (screen coords)
export type HoverCallback = (
  hovered: boolean,
  label: string,
  position: { x: number; y: number }
) => void;

// Props passed to each core component
export interface CoreComponentProps {
  config: CoreConfig;
  status: CoreStatus;
  onGameComplete: () => void;  // Called when core clicked (opens mini-game)
  onHoverChange?: HoverCallback;
}

// Registry entry for dynamic core loading
export interface CoreRegistryEntry {
  id: string;
  config: CoreConfig;
  Component: React.ComponentType<CoreComponentProps>;
}
