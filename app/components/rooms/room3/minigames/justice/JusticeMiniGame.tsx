"use client";

import { TileMatchingGame } from "./TileMatchingGame";
import { justiceParagraphs } from "./justiceQuestions";

const TIME_LIMIT = 150;
const TIME_PENALTY = 5;

interface Props {
  onComplete: () => void;
  onClose: () => void;
}

export function JusticeMiniGame({ onComplete, onClose }: Props) {
  return (
    <TileMatchingGame
      paragraphs={justiceParagraphs}
      timeLimit={TIME_LIMIT}
      timePenalty={TIME_PENALTY}
      onComplete={onComplete}
      onClose={onClose}
    />
  );
}
