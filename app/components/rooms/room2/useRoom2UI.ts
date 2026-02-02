import { create } from 'zustand';

export type CoreId = 'economic-base' | 'superstructure' | 'class-struggle' | 'state-power';

interface TooltipState {
  visible: boolean;
  label?: string;
  position?: [number, number, number];
  color?: string;
}

interface Room2UIStore {
  gameStarted: boolean;
  activeGame: CoreId | null;
  tooltip: TooltipState;

  startGame: () => void;
  openGame: (coreId: CoreId) => void;
  closeGame: () => void;
  setTooltip: (tooltip: TooltipState) => void;
}

export const useRoom2UI = create<Room2UIStore>((set) => ({
  gameStarted: false,
  activeGame: null,
  tooltip: { visible: false },

  startGame: () => set({ gameStarted: true }),
  openGame: (coreId) => set({ activeGame: coreId }),
  closeGame: () => set({ activeGame: null }),
  setTooltip: (tooltip) => set({ tooltip }),
}));
