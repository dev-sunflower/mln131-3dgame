import { BaseCoreVisual } from '../BaseCoreVisual';
import { CoreComponentProps, CoreConfig } from '../types';

export const statePowerConfig: CoreConfig = {
  id: 'state-power',
  label: 'State Power',
  labelVi: 'Chính Quyền Nhà Nước',
  description: 'Dictatorship of the proletariat during transition',
  descriptionVi: 'Chuyên chính vô sản trong thời kỳ quá độ',
  color: '#00aaff',
  position: [2.5, 1.5, 1],
  slotPosition: [0.6, 0.3, -0.6],
};

export function StatePowerCore(props: CoreComponentProps) {
  return <BaseCoreVisual {...props} />;
}
