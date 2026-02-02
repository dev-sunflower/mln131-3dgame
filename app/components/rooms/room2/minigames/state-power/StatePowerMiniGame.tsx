'use client';

import { useState } from 'react';
import { MiniGameShell } from '../MiniGameShell';
import { statePowerQuestions } from './statePowerQuestions';

interface StatePowerMiniGameProps {
  onComplete: () => void;
  onClose: () => void;
}

export function StatePowerMiniGame({ onComplete, onClose }: StatePowerMiniGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  const currentQuestion = statePowerQuestions[currentQuestionIndex];
  const allAnswers = [currentQuestion.correctAnswer, ...currentQuestion.wrongAnswers].sort(() => Math.random() - 0.5);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    setAnsweredQuestions(answeredQuestions + 1);
    if (answer === currentQuestion.correctAnswer) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < statePowerQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else if (score >= statePowerQuestions.length * 0.6) {
      onComplete();
    }
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const isComplete = answeredQuestions === statePowerQuestions.length;
  const passed = score >= statePowerQuestions.length * 0.6;

  return (
    <MiniGameShell
      title="State Power"
      titleVi="Chính Quyền Nhà Nước"
      instructions="Understand the proletarian state"
      instructionsVi="Hiểu về nhà nước vô sản"
      color="#00aaff"
      onClose={onClose}
    >
      <div className="space-y-6">
        <div className="text-center text-white/70 text-sm">
          Câu {currentQuestionIndex + 1} / {statePowerQuestions.length} | Điểm: {score}
        </div>
        {!isComplete ? (
          <>
            <div className="bg-black/50 p-6 rounded-lg border border-cyan-500/30">
              <p className="text-white text-lg mb-2">{currentQuestion.questionVi}</p>
              <p className="text-white/60 text-sm">{currentQuestion.question}</p>
            </div>
            <div className="grid gap-3">
              {allAnswers.map((answer, idx) => (
                <button
                  key={idx}
                  onClick={() => !showResult && handleAnswer(answer)}
                  disabled={showResult}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    showResult && answer === currentQuestion.correctAnswer ? 'bg-green-900/50 border-green-500' :
                    showResult && selectedAnswer === answer ? 'bg-red-900/50 border-red-500' :
                    'bg-gray-900/50 border-gray-700 hover:border-cyan-500/50'
                  }`}
                >
                  <span className="text-white">{answer}</span>
                </button>
              ))}
            </div>
            {showResult && (
              <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`}>
                <p className="text-white font-bold mb-2">{isCorrect ? '✓ Đúng!' : '✗ Sai!'}</p>
                <p className="text-white/90 text-sm mb-1">{currentQuestion.explanationVi}</p>
                <p className="text-white/60 text-xs">{currentQuestion.explanation}</p>
              </div>
            )}
            {showResult && (
              <button onClick={handleNext} className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-display rounded">
                {currentQuestionIndex < statePowerQuestions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
              </button>
            )}
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className={`text-4xl font-display ${passed ? 'text-green-500' : 'text-red-500'}`}>
              {passed ? '🎉 Xuất sắc!' : '😞 Chưa đạt'}
            </div>
            <p className="text-white text-xl">Điểm: {score} / {statePowerQuestions.length}</p>
            {passed ? (
              <button onClick={onComplete} className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-display rounded">Mở khóa Core</button>
            ) : (
              <button onClick={() => window.location.reload()} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-display rounded">Thử lại</button>
            )}
          </div>
        )}
      </div>
    </MiniGameShell>
  );
}
