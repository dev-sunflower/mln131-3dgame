export interface Question {
  question: string;
  questionVi: string;
  correctAnswer: string;
  wrongAnswers: string[];
  explanation: string;
  explanationVi: string;
}

export const statePowerQuestions: Question[] = [
  {
    question: 'What is the "dictatorship of the proletariat"?',
    questionVi: '"Chuyên chính vô sản" là gì?',
    correctAnswer: 'Working class political rule during transition',
    wrongAnswers: [
      'A military dictatorship',
      'Rule by one person',
      'Totalitarian oppression',
    ],
    explanation: 'Dictatorship of the proletariat means political rule by the working class during the transition to communism.',
    explanationVi: 'Chuyên chính vô sản là sự thống trị chính trị của giai cấp công nhân trong thời kỳ quá độ lên chủ nghĩa cộng sản.',
  }
];
