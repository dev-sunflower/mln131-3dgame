'use client';

import { useRoom2UI, CoreId } from '../useRoom2UI';
import { useGameState } from '../../../../hooks/useGameState';
import { EconomicBaseMiniGame } from './economic-base/EconomicBaseMiniGame';
import { SuperstructureMiniGame } from './superstructure/SuperstructureMiniGame';
import { ClassStruggleMiniGame } from './class-struggle/ClassStruggleMiniGame';
import { StatePowerMiniGame } from './state-power/StatePowerMiniGame';

export function Room2MiniGames() {
  const activeGame = useRoom2UI((s) => s.activeGame);
  const closeGame = useRoom2UI((s) => s.closeGame);
  const { unlockCore } = useGameState();

  if (!activeGame) return null;

  const handleComplete = () => {
    unlockCore(activeGame);
    closeGame();
  };

  const handleClose = () => {
    closeGame();
  };

  switch (activeGame) {
    case 'economic-base':
      return <EconomicBaseMiniGame onComplete={handleComplete} onClose={handleClose} />;
    case 'superstructure':
      return <SuperstructureMiniGame onComplete={handleComplete} onClose={handleClose} />;
    case 'class-struggle':
      return <ClassStruggleMiniGame onComplete={handleComplete} onClose={handleClose} />;
    case 'state-power':
      return <StatePowerMiniGame onComplete={handleComplete} onClose={handleClose} />;
    default:
      return null;
  }
}
