'use client';

import { useState, useEffect } from 'react';
import { MiniGameShell } from '../MiniGameShell';
import { economicBaseQuestions, Question } from './economicBaseQuestions';

interface EconomicBaseMiniGameProps {
  onComplete: () => void;
  onClose: () => void;
}

export function EconomicBaseMiniGame({ onComplete, onClose }: EconomicBaseMiniGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  const currentQuestion = economicBaseQuestions[currentQuestionIndex];
  const allAnswers = [
    currentQuestion.correctAnswer,
    ...currentQuestion.wrongAnswers,
  ].sort(() => Math.random() - 0.5);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    setAnsweredQuestions(answeredQuestions + 1);

    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < economicBaseQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Game complete
      if (score >= economicBaseQuestions.length * 0.6) {
        onComplete();
      }
    }
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const isComplete = answeredQuestions === economicBaseQuestions.length;
  const passed = score >= economicBaseQuestions.length * 0.6;

  return (
    <MiniGameShell
      title="Economic Base"
      titleVi="Kinh Tế Cơ Sở"
      instructions="Answer questions about the economic foundation of society"
      instructionsVi="Trả lời câu hỏi về nền tảng kinh tế của xã hội"
      color="#ffaa00"
      onClose={onClose}
    >
      <div className="space-y-6">
        {/* Progress */}
        <div className="text-center text-white/70 text-sm">
          Câu hỏi {currentQuestionIndex + 1} / {economicBaseQuestions.length} | Điểm: {score}
        </div>

        {!isComplete ? (
          <>
            {/* Question */}
            <div className="bg-black/50 p-6 rounded-lg border border-amber-500/30">
              <p className="text-white text-lg mb-2">{currentQuestion.questionVi}</p>
              <p className="text-white/60 text-sm">{currentQuestion.question}</p>
            </div>

            {/* Answers */}
            <div className="grid gap-3">
              {allAnswers.map((answer, idx) => {
                const isSelected = selectedAnswer === answer;
                const isCorrectAnswer = answer === currentQuestion.correctAnswer;
                const showCorrect = showResult && isCorrectAnswer;
                const showWrong = showResult && isSelected && !isCorrectAnswer;

                return (
                  <button
                    key={idx}
                    onClick={() => !showResult && handleAnswer(answer)}
                    disabled={showResult}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      showCorrect
                        ? 'bg-green-900/50 border-green-500'
                        : showWrong
                        ? 'bg-red-900/50 border-red-500'
                        : isSelected
                        ? 'bg-amber-900/30 border-amber-500'
                        : 'bg-gray-900/50 border-gray-700 hover:border-amber-500/50'
                    } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <span className="text-white">{answer}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showResult && (
              <div
                className={`p-4 rounded-lg border ${
                  isCorrect
                    ? 'bg-green-900/30 border-green-500'
                    : 'bg-red-900/30 border-red-500'
                }`}
              >
                <p className="text-white font-bold mb-2">
                  {isCorrect ? '✓ Đúng!' : '✗ Sai!'}
                </p>
                <p className="text-white/90 text-sm mb-1">
                  {currentQuestion.explanationVi}
                </p>
                <p className="text-white/60 text-xs">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Next button */}
            {showResult && (
              <button
                onClick={handleNext}
                className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-display rounded transition-colors"
              >
                {currentQuestionIndex < economicBaseQuestions.length - 1
                  ? 'Câu tiếp theo'
                  : 'Hoàn thành'}
              </button>
            )}
          </>
        ) : (
          /* Results */
          <div className="text-center space-y-4">
            <div
              className={`text-4xl font-display mb-4 ${
                passed ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {passed ? '🎉 Xuất sắc!' : '😞 Chưa đạt'}
            </div>
            <p className="text-white text-xl">
              Điểm số: {score} / {economicBaseQuestions.length}
            </p>
            <p className="text-white/70">
              {passed
                ? 'Bạn đã hiểu về Kinh tế Cơ sở! / You understand the Economic Base!'
                : 'Cần ít nhất 60% để vượt qua. / Need at least 60% to pass.'}
            </p>
            {passed && (
              <button
                onClick={onComplete}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-display rounded transition-colors"
              >
                Mở khóa Core / Unlock Core
              </button>
            )}
            {!passed && (
              <button
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setSelectedAnswer(null);
                  setShowResult(false);
                  setScore(0);
                  setAnsweredQuestions(0);
                }}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-display rounded transition-colors"
              >
                Thử lại / Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </MiniGameShell>
  );
}
