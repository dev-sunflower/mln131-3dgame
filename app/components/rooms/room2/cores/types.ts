export type CoreStatus = 'locked' | 'unlocked' | 'assembled';

export interface CoreConfig {
  id: string;
  label: string;
  labelVi: string;
  description: string;
  descriptionVi: string;
  color: string;
  position: [number, number, number];
  slotPosition: [number, number, number];
}

export type HoverCallback = (
  hovered: boolean,
  label?: string,
  position?: [number, number, number]
) => void;

export interface CoreComponentProps {
  config: CoreConfig;
  status: CoreStatus;
  onGameComplete: () => void;
  onHoverChange: HoverCallback;
}
