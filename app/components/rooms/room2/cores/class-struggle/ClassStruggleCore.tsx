import { BaseCoreVisual } from '../BaseCoreVisual';
import { CoreComponentProps, CoreConfig } from '../types';

export const classStruggleConfig: CoreConfig = {
  id: 'class-struggle',
  label: 'Class Struggle',
  labelVi: 'Đấu Tranh Giai Cấp',
  description: 'The driving force of historical development',
  descriptionVi: 'Động lực của sự phát triển lịch sử',
  color: '#ff0000',
  position: [-2.5, 1.5, 1],
  slotPosition: [-0.6, 0.3, -0.6],
};

export function ClassStruggleCore(props: CoreComponentProps) {
  return <BaseCoreVisual {...props} />;
}
