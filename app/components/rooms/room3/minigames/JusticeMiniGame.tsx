'use client';

import { AnagramGame } from './AnagramGame';

const QUESTIONS = [
  { scrambled: '', answer: 'EQUALITY', hint: 'Same rights for all' },
  { scrambled: '', answer: 'FREEDOM', hint: 'Liberty to act and speak' },
  { scrambled: '', answer: 'RIGHTS', hint: 'What every person deserves' },
];

interface Props {
  onComplete: () => void;
  onClose: () => void;
}

export function JusticeMiniGame({ onComplete, onClose }: Props) {
  return (
    <AnagramGame
      questions={QUESTIONS}
      title="Justice Core"
      color="#ffd700"
      onComplete={onComplete}
      onClose={onClose}
    />
  );
}
