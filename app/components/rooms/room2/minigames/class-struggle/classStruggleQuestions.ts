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
  },
  {
    question: 'What are the two main classes in capitalist society?',
    questionVi: 'Hai giai cấp chính trong xã hội tư bản là gì?',
    correctAnswer: 'Bourgeoisie and proletariat',
    wrongAnswers: [
      'Rich and poor',
      'Educated and uneducated',
      'Urban and rural',
    ],
    explanation: 'The bourgeoisie (capitalists) own the means of production, while the proletariat (workers) must sell their labor.',
    explanationVi: 'Giai cấp tư sản (nhà tư bản) sở hữu tư liệu sản xuất, còn giai cấp vô sản (công nhân) phải bán sức lao động.',
  },
  {
    question: 'What is the ultimate goal of proletarian class struggle?',
    questionVi: 'Mục tiêu cuối cùng của đấu tranh giai cấp vô sản là gì?',
    correctAnswer: 'To abolish all classes and achieve communism',
    wrongAnswers: [
      'To become the new ruling class',
      'To get higher wages only',
      'To reverse roles with capitalists',
    ],
    explanation: 'The proletarian revolution aims to abolish all classes, not just to replace one ruling class with another.',
    explanationVi: 'Cách mạng vô sản hướng tới xóa bỏ mọi giai cấp, không chỉ thay thế giai cấp thống trị này bằng giai cấp khác.',
  },
  {
    question: 'During the transition period, class struggle:',
    questionVi: 'Trong thời kỳ quá độ, đấu tranh giai cấp:',
    correctAnswer: 'Continues in new forms',
    wrongAnswers: [
      'Completely disappears',
      'Becomes more violent',
      'Is no longer necessary',
    ],
    explanation: 'Class struggle continues during the transition period but takes new forms as classes are gradually abolished.',
    explanationVi: 'Đấu tranh giai cấp tiếp tục trong thời kỳ quá độ nhưng mang hình thức mới khi các giai cấp dần bị xóa bỏ.',
  },
];
