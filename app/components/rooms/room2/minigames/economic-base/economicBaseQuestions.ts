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
  },
  {
    question: 'In socialism, who owns the means of production?',
    questionVi: 'Trong chủ nghĩa xã hội, ai sở hữu tư liệu sản xuất?',
    correctAnswer: 'The working class collectively',
    wrongAnswers: [
      'Private capitalists',
      'The government bureaucracy',
      'Foreign investors',
    ],
    explanation: 'Socialist means of production are collectively owned by the working class, not by private capitalists.',
    explanationVi: 'Tư liệu sản xuất xã hội chủ nghĩa thuộc sở hữu tập thể của giai cấp công nhân, không phải tư nhân tư bản.',
  },
  {
    question: 'What determines the economic character of a society?',
    questionVi: 'Điều gì quyết định tính chất kinh tế của một xã hội?',
    correctAnswer: 'Relations of production',
    wrongAnswers: [
      'Level of technology',
      'Natural resources',
      'Population size',
    ],
    explanation: 'The relations of production (who owns what) determine whether a society is capitalist, socialist, etc.',
    explanationVi: 'Quan hệ sản xuất (ai sở hữu cái gì) quyết định xã hội là tư bản, xã hội chủ nghĩa, v.v.',
  },
  {
    question: 'During the transition period, what type of economy does Vietnam have?',
    questionVi: 'Trong thời kỳ quá độ, Việt Nam có loại kinh tế gì?',
    correctAnswer: 'Multi-sector socialist-oriented market economy',
    wrongAnswers: [
      'Pure command economy',
      'Laissez-faire capitalism',
      'Feudal economy',
    ],
    explanation: 'Vietnam has a multi-sector market economy with socialist orientation during the transition period.',
    explanationVi: 'Việt Nam có nền kinh tế thị trường nhiều thành phần định hướng xã hội chủ nghĩa trong thời kỳ quá độ.',
  },
];
