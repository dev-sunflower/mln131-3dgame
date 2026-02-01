'use client';

import { useState, useMemo } from 'react';

interface AnagramQuestion {
  scrambled: string;
  answer: string;
  hint: string;
}

interface AnagramGameProps {
  questions: AnagramQuestion[];
  title: string;
  color: string;
  onComplete: () => void;
  onClose: () => void;
}

function shuffleWord(word: string): string {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join('');
  return result === word ? shuffleWord(word) : result;
}

export function AnagramGame({
  questions,
  title,
  color,
  onComplete,
  onClose,
}: AnagramGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [solved, setSolved] = useState(false);

  const current = questions[currentIndex];
  const scrambled = useMemo(
    () => shuffleWord(current.answer.toUpperCase()),
    [current.answer]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toUpperCase() === current.answer.toUpperCase()) {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
        setInput('');
        setError(false);
      } else {
        setSolved(true);
      }
    } else {
      setError(true);
    }
  };

  if (solved) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
        <div
          className="bg-gray-900 border-2 rounded-lg p-6 max-w-md w-full mx-4 text-center"
          style={{ borderColor: color }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color }}>
            Core Unlocked!
          </h2>
          <p className="text-gray-300 mb-6">You solved all anagrams.</p>
          <button
            onClick={onComplete}
            className="px-6 py-2 rounded text-white font-bold"
            style={{ backgroundColor: color }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-gray-900 border-2 rounded-lg p-6 max-w-md w-full mx-4"
        style={{ borderColor: color }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color }}>
            {title}
          </h2>
          <span className="text-gray-400 text-sm">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>

        <p className="text-gray-400 text-sm mb-2">Unscramble the word:</p>

        <div
          className="text-3xl font-mono tracking-widest text-center py-4 mb-4 rounded bg-gray-800"
          style={{ color }}
        >
          {scrambled}
        </div>

        <p className="text-gray-500 text-sm mb-4 italic">Hint: {current.hint}</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            className={`w-full px-4 py-3 rounded bg-gray-800 text-white text-center text-xl font-mono tracking-wider border-2 outline-none ${
              error ? 'border-red-500' : 'border-gray-700 focus:border-gray-500'
            }`}
            placeholder="Type your answer"
            autoFocus
          />
          {error && (
            <p className="text-red-400 text-sm mt-2 text-center">
              Incorrect, try again!
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded text-white font-bold hover:opacity-90"
              style={{ backgroundColor: color }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
