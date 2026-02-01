"use client";

import { useState, useEffect } from "react";
import { JusticeParagraph } from "./justiceQuestions";

interface TileMatchingGameProps {
  paragraphs: JusticeParagraph[];
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

export function TileMatchingGame({
  paragraphs,
  timeLimit,
  timePenalty = 5,
  onComplete,
  onClose,
}: TileMatchingGameProps) {
  const [step, setStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [filledBlanks, setFilledBlanks] = useState<Record<number, string>>({});
  const [wrongBlank, setWrongBlank] = useState<number | null>(null);
  const [showPenalty, setShowPenalty] = useState(false);
  const [shuffledWords, setShuffledWords] = useState<
    { word: string; originalIdx: number; id: string }[]
  >([]);
  const [usedWordIds, setUsedWordIds] = useState<Set<string>>(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const currentParagraph = paragraphs[step];
  const blanks = currentParagraph.blanks;

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

  // Shuffle words when paragraph changes
  useEffect(() => {
    const wordsWithIdx = blanks.map((word, idx) => ({
      word,
      originalIdx: idx,
      id: `${idx}-${word}`,
    }));
    setShuffledWords(shuffleArray(wordsWithIdx));
    setFilledBlanks({});
    setSelectedWord(null);
    setUsedWordIds(new Set());
  }, [step]);

  // Check if all blanks are filled correctly
  const allFilled = Object.keys(filledBlanks).length === blanks.length;

  // Handle next paragraph or complete
  useEffect(() => {
    if (allFilled && !gameOver) {
      const timer = setTimeout(() => {
        if (step === paragraphs.length - 1) {
          setWon(true);
          setGameOver(true);
        } else {
          setStep((s) => s + 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [allFilled, step, paragraphs.length, gameOver]);

  const handleWordClick = (shuffledIdx: number) => {
    if (gameOver) return;
    const wordData = shuffledWords[shuffledIdx];
    if (usedWordIds.has(wordData.id)) return;
    setSelectedWord(shuffledIdx);
    setWrongBlank(null);
  };

  const handleBlankClick = (blankIdx: number) => {
    if (gameOver) return;
    if (selectedWord === null) return;
    if (filledBlanks[blankIdx] !== undefined) return;

    const wordData = shuffledWords[selectedWord];
    const correctWord = blanks[blankIdx];

    if (wordData.word === correctWord) {
      // Correct!
      setFilledBlanks((prev) => ({
        ...prev,
        [blankIdx]: wordData.word,
      }));
      setUsedWordIds((prev) => new Set(prev).add(wordData.id));
      setSelectedWord(null);
    } else {
      // Wrong! Apply time penalty
      setWrongBlank(blankIdx);
      setShowPenalty(true);
      setTimeLeft((t) => Math.max(0, t - timePenalty));
      setTimeout(() => {
        setWrongBlank(null);
        setShowPenalty(false);
      }, 500);
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Parse paragraph text and render with blanks
  const renderParagraph = () => {
    const text = currentParagraph.text;
    const parts: (string | { type: "blank"; index: number })[] = [];

    let lastIdx = 0;
    const regex = /\[(\d+)\]/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(text.substring(lastIdx, match.index));
      }
      parts.push({ type: "blank", index: parseInt(match[1]) });
      lastIdx = match.index + match[0].length;
    }

    if (lastIdx < text.length) {
      parts.push(text.substring(lastIdx));
    }

    return parts.map((part, idx) => {
      if (typeof part === "string") {
        return (
          <span key={idx} className="text-slate-200">
            {part}
          </span>
        );
      }

      const blankIdx = part.index;
      const isFilled = filledBlanks[blankIdx] !== undefined;
      const isWrong = wrongBlank === blankIdx;

      return (
        <button
          key={idx}
          onClick={() => handleBlankClick(blankIdx)}
          disabled={isFilled || gameOver}
          className={`inline-flex items-center justify-center min-w-[100px] px-3 py-1 mx-1
                     rounded-lg border-2 border-dashed transition-all duration-200
                     ${
                       isFilled
                         ? "bg-emerald-900/50 border-emerald-500 text-emerald-300 font-semibold"
                         : isWrong
                           ? "bg-red-900/60 border-red-500 text-red-200 animate-pulse"
                           : "bg-slate-800/50 border-yellow-500/50 text-yellow-300/50 hover:border-yellow-400 hover:bg-slate-700/50"
                     }`}
        >
          {isFilled ? filledBlanks[blankIdx] : "____"}
        </button>
      );
    });
  };

  // Game over screen
  if (gameOver) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
        <div className="bg-slate-900/95 border border-slate-600 rounded-xl p-10 max-w-xl w-full mx-4 text-center shadow-2xl">
          <h2
            className={`text-3xl font-bold mb-4 ${won ? "text-emerald-400" : "text-red-400"}`}
          >
            {won ? "Core Unlocked!" : "Het Thoi Gian!"}
          </h2>
          <p className="text-slate-300 mb-6">
            {won
              ? `Ban da hoan thanh ${paragraphs.length} doan van!`
              : `Ban da hoan thanh ${step} trong ${paragraphs.length} doan van.`}
          </p>
          <button
            onClick={won ? onComplete : onClose}
            className={`px-6 py-3 rounded font-bold text-white ${
              won
                ? "bg-emerald-700 hover:bg-emerald-600"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            {won ? "Tiep tuc" : "Thu lai"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
               bg-[radial-gradient(circle_at_center,_#eab30822,_#020617_85%)]
               backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-4xl mx-4 p-8 rounded-2xl
                 bg-slate-900/80 backdrop-blur-xl
                 border border-yellow-500/30
                 shadow-[0_0_40px_#eab30844]"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-widest text-yellow-300">
            DIEN TU VAO DOAN VAN
          </h2>

          {/* Timer */}
          <div className="w-48">
            <div className="h-2 rounded bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  showPenalty ? 'bg-red-500' : 'bg-yellow-400'
                }`}
                style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
              />
            </div>
            <div
              className={`mt-1 text-right font-mono text-sm ${
                timeLeft <= 10
                  ? 'text-red-400 animate-pulse'
                  : showPenalty
                    ? 'text-red-400'
                    : 'text-yellow-300'
              }`}
            >
              {formatTime(timeLeft)}
              {showPenalty && <span className="ml-2 text-red-400">-{timePenalty}s</span>}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="text-center mb-4">
          <span className="text-yellow-200/70 text-sm font-mono">
            Doan van {step + 1}/{paragraphs.length}
          </span>
        </div>

        {/* Instruction */}
        <p className="text-center text-slate-400 text-sm mb-6 font-mono">
          CHON TU O TREN, SAU DO CLICK VAO CHO TRONG DE DIEN VAO
        </p>

        {/* Word tiles at the top */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          {shuffledWords.map((item, shuffledIdx) => {
            const isUsed = usedWordIds.has(item.id);
            const isSelected = selectedWord === shuffledIdx;

            return (
              <button
                key={item.id}
                onClick={() => handleWordClick(shuffledIdx)}
                disabled={isUsed}
                className={`px-4 py-2 rounded-lg text-sm font-medium
                           border-2 transition-all duration-200
                           ${
                             isUsed
                               ? "bg-slate-700/30 border-slate-600/30 text-slate-500 line-through cursor-not-allowed"
                               : isSelected
                                 ? "bg-yellow-900/70 border-yellow-400 text-yellow-100 shadow-[0_0_20px_#eab308] scale-105"
                                 : "bg-slate-800 border-slate-600 text-slate-200 hover:border-yellow-500 hover:bg-slate-700"
                           }`}
              >
                {item.word}
              </button>
            );
          })}
        </div>

        {/* Paragraph with blanks */}
        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700 mb-8">
          <p className="text-lg leading-loose">{renderParagraph()}</p>
        </div>

        {/* Progress */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm font-mono">
            DA DIEN: {Object.keys(filledBlanks).length}/{blanks.length}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-yellow-300 transition-colors"
          >
            Thoat
          </button>
        </div>
      </div>
    </div>
  );
}
