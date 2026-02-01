'use client';

import { ReactNode } from 'react';
import { CoreId } from '../useRoom3UI';
import { InnovationMiniGame } from './innovation/InnovationMiniGame';
import { DigitalMiniGame } from './digital/DigitalMiniGame';
import { JusticeMiniGame } from './justice/JusticeMiniGame';

// Factory: returns the correct mini-game component for each core
export function renderMiniGame(
  coreId: CoreId,
  onComplete: () => void,
  onClose: () => void
): ReactNode {
  switch (coreId) {
    case 'innovation':
      return <InnovationMiniGame onComplete={onComplete} onClose={onClose} />;
    case 'digital':
      return <DigitalMiniGame onComplete={onComplete} onClose={onClose} />;
    case 'justice':
      return <JusticeMiniGame onComplete={onComplete} onClose={onClose} />;
    default:
      return null;
  }
}

export { MiniGameShell } from './MiniGameShell';
