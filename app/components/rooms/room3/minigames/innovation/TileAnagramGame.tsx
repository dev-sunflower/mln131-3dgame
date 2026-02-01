'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { InnovationQuestion } from './innovationQuestions';

interface TileAnagramGameProps {
  questions: InnovationQuestion[];
  timeLimit: number; // seconds
  onComplete: () => void;
  onClose: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function TileAnagramGame({
  questions,
  timeLimit,
  onComplete,
  onClose,
}: TileAnagramGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedSlots, setSelectedSlots] = useState<(string | null)[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{ letter: string; used: boolean }[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const current = questions[currentIndex];
  const answerLength = current.answer.replace(/\s/g, '').length;

  // Initialize letters for current question
  useEffect(() => {
    const shuffled = shuffleArray(current.letters);
    setAvailableLetters(shuffled.map((l) => ({ letter: l, used: false })));
    setSelectedSlots(new Array(answerLength).fill(null));
    setIsCorrect(false);
  }, [currentIndex, current.letters, answerLength]);

  // Timer
  useEffect(() => {
    if (gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  // Check answer when slots change
  useEffect(() => {
    if (selectedSlots.includes(null)) return;
    const attempt = selectedSlots.join('');
    const answer = current.answer.replace(/\s/g, '');
    if (attempt === answer) {
      setIsCorrect(true);
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((i) => i + 1);
        } else {
          setWon(true);
          setGameOver(true);
        }
      }, 800);
    }
  }, [selectedSlots, current.answer, currentIndex, questions.length]);

  // Click available letter → add to first empty slot
  const handleLetterClick = useCallback((index: number) => {
    if (availableLetters[index].used || isCorrect) return;

    const emptySlotIndex = selectedSlots.findIndex((s) => s === null);
    if (emptySlotIndex === -1) return;

    setAvailableLetters((prev) =>
      prev.map((l, i) => (i === index ? { ...l, used: true } : l))
    );
    setSelectedSlots((prev) => {
      const next = [...prev];
      next[emptySlotIndex] = availableLetters[index].letter;
      return next;
    });
  }, [availableLetters, selectedSlots, isCorrect]);

  // Click filled slot → return letter to available
  const handleSlotClick = useCallback((slotIndex: number) => {
    if (selectedSlots[slotIndex] === null || isCorrect) return;

    const letter = selectedSlots[slotIndex];
    const letterIndex = availableLetters.findIndex(
      (l) => l.letter === letter && l.used
    );

    if (letterIndex !== -1) {
      setAvailableLetters((prev) =>
        prev.map((l, i) => (i === letterIndex ? { ...l, used: false } : l))
      );
    }
    setSelectedSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  }, [selectedSlots, availableLetters, isCorrect]);

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Game over screen
  if (gameOver) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/85 z-50">
        <div className="bg-gray-900 border-2 border-cyan-500 rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <h2 className={`text-3xl font-bold mb-4 ${won ? 'text-cyan-400' : 'text-red-400'}`}>
            {won ? '🎉 Core Unlocked!' : '⏰ Time\'s Up!'}
          </h2>
          <p className="text-gray-300 mb-6">
            {won
              ? `You solved all ${questions.length} puzzles!`
              : `You completed ${currentIndex} of ${questions.length} puzzles.`}
          </p>
          <button
            onClick={won ? onComplete : onClose}
            className={`px-6 py-3 rounded font-bold text-white ${
              won ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-gray-600 hover:bg-gray-500'
            }`}
          >
            {won ? 'Continue' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/85 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-900 border-2 border-cyan-500 rounded-lg p-6 max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-cyan-400">Innovation Core</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">
              {currentIndex + 1}/{questions.length}
            </span>
            <span
              className={`font-mono text-lg font-bold ${
                timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-cyan-300'
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <p className="text-lg text-gray-200 text-center leading-relaxed">
            {current.question}
          </p>
        </div>

        {/* Answer Slots */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {selectedSlots.map((letter, i) => (
            <button
              key={i}
              onClick={() => handleSlotClick(i)}
              className={`w-12 h-12 rounded border-2 text-xl font-bold transition-all ${
                letter
                  ? isCorrect
                    ? 'bg-green-600 border-green-400 text-white'
                    : 'bg-cyan-900 border-cyan-400 text-cyan-100 hover:bg-cyan-800'
                  : 'bg-gray-800 border-gray-600 text-gray-500'
              }`}
            >
              {letter || '_'}
            </button>
          ))}
        </div>

        {/* Available Letters */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {availableLetters.map((item, i) => (
            <button
              key={i}
              onClick={() => handleLetterClick(i)}
              disabled={item.used}
              className={`w-12 h-12 rounded text-xl font-bold transition-all ${
                item.used
                  ? 'bg-gray-800 border-2 border-gray-700 text-gray-700'
                  : 'bg-cyan-700 border-2 border-cyan-400 text-white hover:bg-cyan-600 hover:scale-105'
              }`}
            >
              {item.letter}
            </button>
          ))}
        </div>

        {/* Hint */}
        <p className="text-center text-gray-500 text-sm">
          Click letters to fill the blanks. Click filled slots to remove.
        </p>

        {/* Cancel button */}
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
