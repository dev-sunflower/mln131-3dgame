"use client";

import { useState, useEffect } from "react";
import { DigitalQuestion } from "./digitalQuestions";

// HÀM CHUẨN HOÁ CHUỖI
const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

interface TileFillBlankGameProps {
  questions: DigitalQuestion[];
  timeLimit: number; // seconds
  onComplete: () => void;
  onClose: () => void;
}

export function TileFillBlankGame({
  questions,
  timeLimit,
  onComplete,
  onClose,
}: TileFillBlankGameProps) {
  const [step, setStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const currentPuzzle = questions[step];

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

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    if (gameOver) return;

    if (normalize(answer) === normalize(currentPuzzle.answer)) {
      setError("");
      setAnswer("");

      if (step === questions.length - 1) {
        setWon(true);
        setGameOver(true);
      } else {
        setStep((prev) => prev + 1);
      }
    } else {
      setError("Sai roi, thu lai nhe!");
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // Game over screen
  if (gameOver) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center
               bg-black/90 backdrop-blur-sm"
      >
        <div
          className="relative bg-slate-900/95 border border-purple-500/40
                 rounded-2xl p-10 max-w-xl w-full mx-4
                 text-center shadow-[0_0_60px_#a855f766]"
        >
          {/* Neon line */}
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />

          <h2
            className={`text-3xl font-bold mb-4 tracking-widest ${
              won ? "text-purple-300" : "text-red-400"
            }`}
          >
            {won ? "LÕI ĐÃ ĐƯỢC MỞ KHOÁ" : "HẾT THỜI GIAN"}
          </h2>

          <p className="text-slate-300 mb-8 font-mono">
            {won
              ? `Bạn đã hoàn thành ${questions.length} câu hỏi.`
              : `Bạn đã trả lời ${step} / ${questions.length} câu hỏi.`}
          </p>

          <button
            onClick={won ? onComplete : onClose}
            className={`px-8 py-3 rounded-lg font-bold tracking-wide text-white
                    transition-all duration-200
                    ${
                      won
                        ? "bg-purple-700 hover:bg-purple-600 hover:shadow-[0_0_30px_#a855f7]"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
          >
            {won ? "TIẾP TỤC" : "THỬ LẠI"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
               bg-[radial-gradient(circle_at_top,_#7c3aed33,_#020617_85%)]
               backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-3xl mx-4 p-8 rounded-2xl
                 bg-slate-900/70 backdrop-blur-xl
                 border border-purple-500/40
                 shadow-[0_0_40px_#a855f766]"
      >
        {/* Neon top line */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold tracking-widest text-purple-300">
            LÕI KỸ THUẬT SỐ: {step + 1} / {questions.length}
          </h2>

          <div className="w-48">
            <div className="h-2 rounded bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-purple-400 transition-all duration-500"
                style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
              />
            </div>
            <div
              className={`mt-1 text-right font-mono text-sm ${
                timeLeft <= 10
                  ? "text-red-400 animate-pulse"
                  : "text-purple-300"
              }`}
            >
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Question */}
        <div
          className="relative mb-10 rounded-lg border border-slate-700
                   bg-slate-950/70 p-5 font-mono text-purple-200"
        >
          <span className="absolute -top-3 left-4 bg-slate-900 px-2 text-xs text-purple-400">
            CÂU HỎI
          </span>
          <p className="text-center text-lg leading-relaxed">
            {currentPuzzle.question}
          </p>
        </div>

        {/* Input Answer */}
        <div className="flex justify-center mb-8">
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="> NHẬP ĐÁP ÁN GIẢI MÃ"
            className="w-full max-w-xl p-4
                     rounded-lg border border-purple-500/40
                     bg-slate-900 text-purple-200
                     text-center text-lg font-mono tracking-widest
                     placeholder:text-purple-400/40
                     focus:outline-none focus:border-purple-400
                     focus:shadow-[0_0_30px_#a855f7]
                     transition-all duration-200"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-center text-red-400 font-mono mb-6 animate-pulse">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 text-lg font-bold
                     bg-purple-700 text-white rounded-lg
                     hover:bg-purple-600
                     hover:shadow-[0_0_25px_#a855f7]
                     transition-all duration-200"
          >
            XÁC NHẬN
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3 text-slate-400 hover:text-purple-300"
          >
            THOÁT MINI GAME
          </button>
        </div>
      </div>
    </div>
  );
}
