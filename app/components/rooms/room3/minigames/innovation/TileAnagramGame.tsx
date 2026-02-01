"use client";

import { useState, useEffect, useCallback } from "react";
import { InnovationQuestion } from "./innovationQuestions";

interface TileAnagramGameProps {
  questions: InnovationQuestion[];
  timeLimit: number; // seconds
  timePenalty?: number; // seconds to subtract on wrong answer
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
  timePenalty = 5,
  onComplete,
  onClose,
}: TileAnagramGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedSlots, setSelectedSlots] = useState<(string | null)[]>([]);
  const [availableLetters, setAvailableLetters] = useState<
    { letter: string; used: boolean }[]
  >([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const current = questions[currentIndex];
  const answerLength = current.answer.replace(/\s/g, "").length;
  const words = current.answer.split(" "); // For visual spacing

  // Initialize letters for current question
  useEffect(() => {
    const shuffled = shuffleArray(current.letters);
    setAvailableLetters(shuffled.map((l) => ({ letter: l, used: false })));
    setSelectedSlots(new Array(answerLength).fill(null));
    setIsCorrect(false);
    setIsWrong(false);
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
    const attempt = selectedSlots.join("");
    const answer = current.answer.replace(/\s/g, "");
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
    } else {
      // Wrong answer - apply time penalty
      setIsWrong(true);
      setTimeLeft((t) => Math.max(0, t - timePenalty));
      setTimeout(() => {
        setIsWrong(false);
        // Reset slots for retry
        setSelectedSlots(new Array(answerLength).fill(null));
        setAvailableLetters((prev) => prev.map((l) => ({ ...l, used: false })));
      }, 500);
    }
  }, [
    selectedSlots,
    current.answer,
    currentIndex,
    questions.length,
    timePenalty,
    answerLength,
  ]);

  // Click available letter → add to first empty slot
  const handleLetterClick = useCallback(
    (index: number) => {
      if (availableLetters[index].used || isCorrect || isWrong) return;

      const emptySlotIndex = selectedSlots.findIndex((s) => s === null);
      if (emptySlotIndex === -1) return;

      setAvailableLetters((prev) =>
        prev.map((l, i) => (i === index ? { ...l, used: true } : l)),
      );
      setSelectedSlots((prev) => {
        const next = [...prev];
        next[emptySlotIndex] = availableLetters[index].letter;
        return next;
      });
    },
    [availableLetters, selectedSlots, isCorrect, isWrong],
  );

  // Click filled slot → return letter to available
  const handleSlotClick = useCallback(
    (slotIndex: number) => {
      if (selectedSlots[slotIndex] === null || isCorrect || isWrong) return;

      const letter = selectedSlots[slotIndex];
      const letterIndex = availableLetters.findIndex(
        (l) => l.letter === letter && l.used,
      );

      if (letterIndex !== -1) {
        setAvailableLetters((prev) =>
          prev.map((l, i) => (i === letterIndex ? { ...l, used: false } : l)),
        );
      }
      setSelectedSlots((prev) => {
        const next = [...prev];
        next[slotIndex] = null;
        return next;
      });
    },
    [selectedSlots, availableLetters, isCorrect, isWrong],
  );

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Game over screen
  if (gameOver) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
        <div className="bg-slate-900/95 border border-slate-600 rounded-xl p-10 max-w-xl w-full mx-4 text-center shadow-2xl">
          <h2
            className={`text-3xl font-bold mb-4 ${won ? "text-emerald-400" : "text-red-400"}`}
          >
            {won ? "Core Unlocked!" : "Time's Up!"}
          </h2>
          <p className="text-slate-300 mb-6">
            {won
              ? `You solved all ${questions.length} puzzles!`
              : `You completed ${currentIndex} of ${questions.length} puzzles.`}
          </p>
          <button
            onClick={won ? onComplete : onClose}
            className={`px-6 py-3 rounded font-bold text-white ${
              won
                ? "bg-emerald-700 hover:bg-emerald-600"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            {won ? "Continue" : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
               bg-[radial-gradient(circle_at_top,_#0f766e33,_#020617_85%)]
               backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-3xl mx-4 p-8 rounded-2xl
                 bg-slate-900/70 backdrop-blur-xl
                 border border-teal-500/40
                 shadow-[0_0_40px_#14b8a633]"
      >
        {/* Neon top line */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent" />

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold tracking-widest text-teal-300">
            LÕI GIẢI MÃ: {currentIndex + 1} / {questions.length}
          </h2>

          <div className="w-48">
            <div className="h-2 rounded bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isWrong ? "bg-red-500" : "bg-teal-400"
                }`}
                style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
              />
            </div>
            <div
              className={`mt-1 text-right font-mono text-sm ${
                timeLeft <= 10
                  ? "text-red-400 animate-pulse"
                  : isWrong
                    ? "text-red-400"
                    : "text-teal-300"
              }`}
            >
              {formatTime(timeLeft)}
              {isWrong && (
                <span className="ml-2 text-red-400">-{timePenalty}s</span>
              )}
            </div>
          </div>
        </div>

        {/* Question */}
        <div
          className="relative mb-10 rounded-lg border border-slate-700
                      bg-slate-950/70 p-5 font-mono text-teal-200"
        >
          <span className="absolute -top-3 left-4 bg-slate-900 px-2 text-xs text-teal-400">
            CÂU HỎI
          </span>
          <p className="text-center text-lg leading-relaxed">
            {current.question}
          </p>
        </div>

        {/* Answer Slots */}
        <div className="flex justify-center gap-x-10 gap-y-4 mb-10 flex-wrap">
          {(() => {
            let slotIndex = 0;
            return words.map((word, wIdx) => (
              <div
                key={wIdx}
                className="flex gap-2 px-2 py-1 rounded-lg
             border border-slate-700/50"
              >
                {word.split("").map((_, cIdx) => {
                  const idx = slotIndex++;
                  const letter = selectedSlots[idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSlotClick(idx)}
                      className={`w-12 h-12 text-xl font-bold
                      clip-path-hex transition-all duration-200
                      ${
                        letter
                          ? isCorrect
                            ? "bg-emerald-500 text-black shadow-[0_0_20px_#34d399]"
                            : isWrong
                              ? "bg-red-500 text-white shadow-[0_0_20px_#ef4444] animate-pulse"
                              : "bg-slate-700 text-teal-200 hover:bg-slate-600"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {letter || "_"}
                    </button>
                  );
                })}
              </div>
            ));
          })()}
        </div>

        {/* Available Letters */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {availableLetters.map((item, i) => (
            <button
              key={i}
              onClick={() => handleLetterClick(i)}
              disabled={item.used}
              className={`w-12 h-12 text-xl font-bold
              clip-path-hex transition-all duration-200
              ${
                item.used
                  ? "bg-slate-900 text-slate-700"
                  : "bg-teal-600 text-black hover:scale-110 hover:shadow-[0_0_25px_#14b8a6]"
              }`}
            >
              {item.letter}
            </button>
          ))}
        </div>

        {/* Hint */}
        <p className="text-center text-slate-500 text-sm font-mono">
          GỢI Ý: {current.hint}
        </p>

        {/* Cancel */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-teal-300"
          >
            THOÁT MINI GAME
          </button>
        </div>
      </div>
    </div>
  );
}
