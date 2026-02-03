export interface Question {
  question: string;
  questionVi: string;
  correctAnswer: string;
  wrongAnswers: string[];
  explanation: string;
  explanationVi: string;
}

export const superstructureQuestions: Question[] = [
  {
    question: 'The superstructure is built upon which foundation?',
    questionVi: 'Kiến trúc thượng tầng được xây dựng trên nền tảng nào?',
    correctAnswer: 'The economic base',
    wrongAnswers: [
      'Religious beliefs',
      'Individual choices',
      'Natural geography',
    ],
    explanation: 'The superstructure (politics, law, ideology, culture) is determined by and built on the economic base.',
    explanationVi: 'Kiến trúc thượng tầng (chính trị, pháp luật, ý thức hệ, văn hóa) được quyết định và xây dựng trên cơ sở kinh tế.',
  }
];
