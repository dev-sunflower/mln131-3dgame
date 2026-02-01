'use client';

import { innovationQuestions } from './innovation/innovationQuestions';
import { TileAnagramGame } from './innovation/TileAnagramGame';

const TIME_LIMIT = 120; // 2 minutes

interface Props {
  onComplete: () => void;
  onClose: () => void;
}


export function DigitalMiniGame({ onComplete, onClose }: Props) {
  return (
   <TileAnagramGame
         questions={innovationQuestions}
         timeLimit={TIME_LIMIT}
         onComplete={onComplete}
         onClose={onClose}
       />
  );
}
