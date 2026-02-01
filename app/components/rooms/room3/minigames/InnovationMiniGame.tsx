'use client';

import { TileAnagramGame } from './innovation/TileAnagramGame';
import { innovationQuestions } from './innovation/innovationQuestions';

const TIME_LIMIT = 120; // 2 minutes

interface Props {
  onComplete: () => void;
  onClose: () => void;
}

export function InnovationMiniGame({ onComplete, onClose }: Props) {
  return (
    <TileAnagramGame
      questions={innovationQuestions}
      timeLimit={TIME_LIMIT}
      onComplete={onComplete}
      onClose={onClose}
    />
  );
}
