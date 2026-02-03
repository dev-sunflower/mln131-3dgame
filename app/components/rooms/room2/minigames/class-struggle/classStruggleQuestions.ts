export interface Question {
  question: string;
  questionVi: string;
  correctAnswer: string;
  wrongAnswers: string[];
  explanation: string;
  explanationVi: string;
}

export const classStruggleQuestions: Question[] = [
  {
    question: 'According to Marx, what is the driving force of history?',
    questionVi: 'Theo Marx, động lực của lịch sử là gì?',
    correctAnswer: 'Class struggle',
    wrongAnswers: [
      'Great individuals',
      'Divine will',
      'Random chance',
    ],
    explanation: 'Marx stated that "The history of all hitherto existing society is the history of class struggles."',
    explanationVi: 'Marx nói: "Lịch sử của mọi xã hội cho đến nay là lịch sử của đấu tranh giai cấp."',
  }
];
