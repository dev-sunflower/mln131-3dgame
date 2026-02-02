import { BaseCoreVisual } from '../BaseCoreVisual';
import { CoreComponentProps, CoreConfig } from '../types';

export const economicBaseConfig: CoreConfig = {
  id: 'economic-base',
  label: 'Economic Base',
  labelVi: 'Kinh Tế Cơ Sở',
  description: 'The foundation of society - productive forces and relations of production',
  descriptionVi: 'Nền tảng của xã hội - lực lượng sản xuất và quan hệ sản xuất',
  color: '#ffaa00',
  position: [-2.5, 1.5, -2],
  slotPosition: [-0.6, 0.3, 0.6],
};

export function EconomicBaseCore(props: CoreComponentProps) {
  return <BaseCoreVisual {...props} />;
}
