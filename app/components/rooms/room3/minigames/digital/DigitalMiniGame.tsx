'use client';

import { TileFillBlankGame } from './TileFillBlankGame';
import { digitalQuestions } from './digitalQuestions';

const TIME_LIMIT = 120; // 2 minutes

interface Props {
  onComplete: () => void;
  onClose: () => void;
}

export function DigitalMiniGame({ onComplete, onClose }: Props) {
  return (
    <TileFillBlankGame
      questions={digitalQuestions}
      timeLimit={TIME_LIMIT}
      onComplete={onComplete}
      onClose={onClose}
    />
  );
}
