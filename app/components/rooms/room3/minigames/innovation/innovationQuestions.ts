export interface InnovationQuestion {
  question: string;
  answer: string;
  letters: string[];
  hint?: string;
}

export const innovationQuestions: InnovationQuestion[] = [
  {
    question: 'Giữa xã hội tư bản và xã hội cộng sản là một thời kỳ _____ cách mạng',
    answer: 'QUÁ ĐỘ',
    letters: ['Q', 'U', 'Á', 'Đ', 'Ộ'],
    hint: 'Giai đoạn trung gian bắt buộc theo Mác – Lênin',
  },
];

