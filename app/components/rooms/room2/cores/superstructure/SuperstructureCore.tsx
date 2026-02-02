import { BaseCoreVisual } from '../BaseCoreVisual';
import { CoreComponentProps, CoreConfig } from '../types';

export const superstructureConfig: CoreConfig = {
  id: 'superstructure',
  label: 'Superstructure',
  labelVi: 'Kiến Trúc Thượng Tầng',
  description: 'Politics, law, ideology, culture built on economic base',
  descriptionVi: 'Chính trị, pháp luật, ý thức hệ, văn hóa được xây dựng trên cơ sở kinh tế',
  color: '#aa00ff',
  position: [2.5, 1.5, -2],
  slotPosition: [0.6, 0.3, 0.6],
};

export function SuperstructureCore(props: CoreComponentProps) {
  return <BaseCoreVisual {...props} />;
}
