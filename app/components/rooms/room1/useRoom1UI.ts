import { create } from 'zustand';

interface Room1UIStore {
  gameStarted: boolean;
  showQuiz: boolean;
  quizCompleted: boolean;

  startGame: () => void;
  openQuiz: () => void;
  closeQuiz: () => void;
  completeQuiz: () => void;
}

export const useRoom1UI = create<Room1UIStore>((set) => ({
  gameStarted: false,
  showQuiz: false,
  quizCompleted: false,

  startGame: () => set({ gameStarted: true }),
  openQuiz: () => set({ showQuiz: true }),
  closeQuiz: () => set({ showQuiz: false }),
  completeQuiz: () => set({ quizCompleted: true, showQuiz: false }),
}));
