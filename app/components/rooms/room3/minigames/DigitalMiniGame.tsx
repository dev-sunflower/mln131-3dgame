'use client';

import { AnagramGame } from './AnagramGame';

const QUESTIONS = [
  { scrambled: '', answer: 'BINARY', hint: 'The language of computers (0s and 1s)' },
  { scrambled: '', answer: 'NETWORK', hint: 'Connected systems' },
  { scrambled: '', answer: 'ALGORITHM', hint: 'Step-by-step instructions' },
];

interface Props {
  onComplete: () => void;
  onClose: () => void;
}

export function DigitalMiniGame({ onComplete, onClose }: Props) {
  return (
    <AnagramGame
      questions={QUESTIONS}
      title="Digital Core"
      color="#bd00ff"
      onComplete={onComplete}
      onClose={onClose}
    />
  );
}
