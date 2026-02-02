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
  },
  {
    question: 'What is the main task of the socialist state?',
    questionVi: 'Nhiệm vụ chính của nhà nước xã hội chủ nghĩa là gì?',
    correctAnswer: 'To build socialism and defend the revolution',
    wrongAnswers: [
      'To suppress all opposition',
      'To maximize GDP growth',
      'To expand territory',
    ],
    explanation: 'The socialist state works to build socialism, defend the revolution, and eventually create conditions for its own withering away.',
    explanationVi: 'Nhà nước xã hội chủ nghĩa xây dựng chủ nghĩa xã hội, bảo vệ cách mạng và tạo điều kiện cho sự tiêu vong của chính nó.',
  },
  {
    question: 'Who leads the Vietnamese state during the transition period?',
    questionVi: 'Ai lãnh đạo nhà nước Việt Nam trong thời kỳ quá độ?',
    correctAnswer: 'The Communist Party of Vietnam',
    wrongAnswers: [
      'Multiple political parties equally',
      'The military',
      'International organizations',
    ],
    explanation: 'The Communist Party of Vietnam leads the state in building socialism during the transition period.',
    explanationVi: 'Đảng Cộng sản Việt Nam lãnh đạo nhà nước xây dựng chủ nghĩa xã hội trong thời kỳ quá độ.',
  },
  {
    question: 'According to Marx, the state will eventually:',
    questionVi: 'Theo Marx, nhà nước cuối cùng sẽ:',
    correctAnswer: 'Wither away in communist society',
    wrongAnswers: [
      'Become more powerful forever',
      'Transform into a corporation',
      'Merge with religion',
    ],
    explanation: 'In communist society, when classes are abolished, the state as an instrument of class rule will wither away.',
    explanationVi: 'Trong xã hội cộng sản, khi các giai cấp bị xóa bỏ, nhà nước như công cụ thống trị giai cấp sẽ tiêu vong.',
  },
];
