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
  },
  {
    question: 'What is the main function of superstructure in class society?',
    questionVi: 'Chức năng chính của kiến trúc thượng tầng trong xã hội giai cấp là gì?',
    correctAnswer: 'To maintain the rule of the dominant class',
    wrongAnswers: [
      'To promote individual freedom',
      'To protect all citizens equally',
      'To prevent social change',
    ],
    explanation: 'The superstructure serves to maintain and legitimize the rule of the economically dominant class.',
    explanationVi: 'Kiến trúc thượng tầng phục vụ để duy trì và hợp pháp hóa sự thống trị của giai cấp thống trị kinh tế.',
  },
  {
    question: 'In socialist society, whose interests does the superstructure serve?',
    questionVi: 'Trong xã hội xã hội chủ nghĩa, kiến trúc thượng tầng phục vụ lợi ích của ai?',
    correctAnswer: 'The working people',
    wrongAnswers: [
      'The bourgeoisie',
      'Foreign powers',
      'Only the party elite',
    ],
    explanation: 'Socialist superstructure serves the interests of the working class and all working people.',
    explanationVi: 'Kiến trúc thượng tầng xã hội chủ nghĩa phục vụ lợi ích của giai cấp công nhân và toàn thể nhân dân lao động.',
  },
  {
    question: 'What type of ideology dominates in socialist superstructure?',
    questionVi: 'Loại ý thức hệ nào chiếm ưu thế trong kiến trúc thượng tầng xã hội chủ nghĩa?',
    correctAnswer: 'Marxist-Leninist ideology',
    wrongAnswers: [
      'Liberal individualism',
      'Religious fundamentalism',
      'Nationalist chauvinism',
    ],
    explanation: 'Marxist-Leninist ideology guides the socialist superstructure and social development.',
    explanationVi: 'Tư tưởng Mác-Lênin chỉ đạo kiến trúc thượng tầng xã hội chủ nghĩa và sự phát triển xã hội.',
  },
];
