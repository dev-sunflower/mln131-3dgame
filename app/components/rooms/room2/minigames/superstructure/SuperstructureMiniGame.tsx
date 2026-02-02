'use client';

import { useState } from 'react';
import { MiniGameShell } from '../MiniGameShell';
import { superstructureQuestions } from './superstructureQuestions';

interface SuperstructureMiniGameProps {
  onComplete: () => void;
  onClose: () => void;
}

export function SuperstructureMiniGame({ onComplete, onClose }: SuperstructureMiniGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  const currentQuestion = superstructureQuestions[currentQuestionIndex];
  const allAnswers = [
    currentQuestion.correctAnswer,
    ...currentQuestion.wrongAnswers,
  ].sort(() => Math.random() - 0.5);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    setAnsweredQuestions(answeredQuestions + 1);
    if (answer === currentQuestion.correctAnswer) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < superstructureQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else if (score >= superstructureQuestions.length * 0.6) {
      onComplete();
    }
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const isComplete = answeredQuestions === superstructureQuestions.length;
  const passed = score >= superstructureQuestions.length * 0.6;

  return (
    <MiniGameShell
      title="Superstructure"
      titleVi="Kiến Trúc Thượng Tầng"
      instructions="Answer questions about politics, law, and ideology"
      instructionsVi="Trả lời câu hỏi về chính trị, pháp luật và ý thức hệ"
      color="#aa00ff"
      onClose={onClose}
    >
      <div className="space-y-6">
        <div className="text-center text-white/70 text-sm">
          Câu {currentQuestionIndex + 1} / {superstructureQuestions.length} | Điểm: {score}
        </div>

        {!isComplete ? (
          <>
            <div className="bg-black/50 p-6 rounded-lg border border-purple-500/30">
              <p className="text-white text-lg mb-2">{currentQuestion.questionVi}</p>
              <p className="text-white/60 text-sm">{currentQuestion.question}</p>
            </div>

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
                      showCorrect ? 'bg-green-900/50 border-green-500' :
                      showWrong ? 'bg-red-900/50 border-red-500' :
                      'bg-gray-900/50 border-gray-700 hover:border-purple-500/50'
                    }`}
                  >
                    <span className="text-white">{answer}</span>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`}>
                <p className="text-white font-bold mb-2">{isCorrect ? '✓ Đúng!' : '✗ Sai!'}</p>
                <p className="text-white/90 text-sm mb-1">{currentQuestion.explanationVi}</p>
                <p className="text-white/60 text-xs">{currentQuestion.explanation}</p>
              </div>
            )}

            {showResult && (
              <button onClick={handleNext} className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-display rounded transition-colors">
                {currentQuestionIndex < superstructureQuestions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
              </button>
            )}
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className={`text-4xl font-display mb-4 ${passed ? 'text-green-500' : 'text-red-500'}`}>
              {passed ? '🎉 Xuất sắc!' : '😞 Chưa đạt'}
            </div>
            <p className="text-white text-xl">Điểm: {score} / {superstructureQuestions.length}</p>
            {passed ? (
              <button onClick={onComplete} className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-display rounded">
                Mở khóa Core
              </button>
            ) : (
              <button onClick={() => window.location.reload()} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-display rounded">
                Thử lại
              </button>
            )}
          </div>
        )}
      </div>
    </MiniGameShell>
  );
}
