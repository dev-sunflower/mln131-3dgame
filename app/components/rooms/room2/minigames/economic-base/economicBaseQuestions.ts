export interface Question {
  question: string;
  questionVi: string;
  correctAnswer: string;
  wrongAnswers: string[];
  explanation: string;
  explanationVi: string;
}

export const economicBaseQuestions: Question[] = [
  {
    question: 'What are the two main components of the Economic Base?',
    questionVi: 'Hai thành phần chính của Kinh tế Cơ sở là gì?',
    correctAnswer: 'Productive forces and relations of production',
    wrongAnswers: [
      'Supply and demand',
      'Capital and labor',
      'Money and commodities',
    ],
    explanation: 'The economic base consists of productive forces (tools, technology, labor) and relations of production (ownership, class relations).',
    explanationVi: 'Kinh tế cơ sở bao gồm lực lượng sản xuất (công cụ, công nghệ, lao động) và quan hệ sản xuất (quyền sở hữu, quan hệ giai cấp).',
  }
];
