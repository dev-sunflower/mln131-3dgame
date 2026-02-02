import { EconomicBaseCore, economicBaseConfig } from './economic-base';
import { SuperstructureCore, superstructureConfig } from './superstructure';
import { ClassStruggleCore, classStruggleConfig } from './class-struggle';
import { StatePowerCore, statePowerConfig } from './state-power';
import { CoreConfig } from './types';

export const coreRegistry = [
  {
    id: 'economic-base',
    config: economicBaseConfig,
    Component: EconomicBaseCore,
  },
  {
    id: 'superstructure',
    config: superstructureConfig,
    Component: SuperstructureCore,
  },
  {
    id: 'class-struggle',
    config: classStruggleConfig,
    Component: ClassStruggleCore,
  },
  {
    id: 'state-power',
    config: statePowerConfig,
    Component: StatePowerCore,
  },
];

export { economicBaseConfig, superstructureConfig, classStruggleConfig, statePowerConfig };
