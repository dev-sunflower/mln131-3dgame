export interface InnovationQuestion {
  question: string;
  answer: string;
  letters: string[];
  hint?: string;
}

export const innovationQuestions: InnovationQuestion[] = [
  {
    question: 'Một _____ đau, cả tàu bỏ cỏ',
    answer: 'CON NGỰA',
    letters: ['C', 'O', 'N', 'N', 'G', 'Ự', 'A'],
    hint: 'Thành ngữ về sự đoàn kết',
  },
  {
    question: 'Có công mài sắt, có ngày nên _____',
    answer: 'KIM',
    letters: ['K', 'I', 'M'],
    hint: 'Thành ngữ về sự kiên trì',
  },
  {
    question: 'Uống nước nhớ _____',
    answer: 'NGUỒN',
    letters: ['N', 'G', 'U', 'Ồ', 'N'],
    hint: 'Thành ngữ về lòng biết ơn',
  },
];
