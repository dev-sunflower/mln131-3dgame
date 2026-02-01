'use client';

import { TileAnagramGame } from './TileAnagramGame';
import { innovationQuestions } from './innovationQuestions';

const TIME_LIMIT = 120; // 2 minutes
const TIME_PENALTY = 5; // -5 seconds on wrong answer

interface Props {
  onComplete: () => void;
  onClose: () => void;
}

export function InnovationMiniGame({ onComplete, onClose }: Props) {
  return (
    <TileAnagramGame
      questions={innovationQuestions}
      timeLimit={TIME_LIMIT}
      timePenalty={TIME_PENALTY}
      onComplete={onComplete}
      onClose={onClose}
    />
  );
}
