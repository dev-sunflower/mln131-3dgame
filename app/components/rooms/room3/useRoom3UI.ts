import { create } from 'zustand';

export type CoreId = 'innovation' | 'digital' | 'justice';

interface TooltipState {
  visible: boolean;
  label: string;
  position: { x: number; y: number };
  color: string;
}

interface Room3UIStore {
  activeCoreId: CoreId | null;
  tooltip: TooltipState;
  gameStarted: boolean;
  openGame: (coreId: CoreId) => void;
  closeGame: () => void;
  setTooltip: (tooltip: TooltipState) => void;
  startGame: () => void;
  resetGame: () => void;
}

export const useRoom3UI = create<Room3UIStore>((set) => ({
  activeCoreId: null,
  tooltip: { visible: false, label: '', position: { x: 0, y: 0 }, color: '#fff' },
  gameStarted: false,
  openGame: (coreId) => set({ activeCoreId: coreId }),
  closeGame: () => set({ activeCoreId: null }),
  setTooltip: (tooltip) => set({ tooltip }),
  startGame: () => set({ gameStarted: true }),
  resetGame: () => set({ gameStarted: false, activeCoreId: null }),
}));
