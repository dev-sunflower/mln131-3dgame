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
  {
    question: 'Nhà nước trong thời kỳ quá độ là nền chuyên chính của giai cấp _____',
    answer: 'VÔ SẢN',
    letters: ['V', 'Ô', 'S', 'Ả', 'N'],
    hint: 'Giai cấp lãnh đạo cách mạng xã hội chủ nghĩa',
  },
  {
    question: 'Chủ nghĩa xã hội là giai đoạn _____ của hình thái kinh tế – xã hội cộng sản',
    answer: 'THẤP',
    letters: ['T', 'H', 'Ấ', 'P'],
    hint: 'Giai đoạn đầu, chưa hoàn chỉnh',
  },
  {
    question: 'Nguyên tắc phân phối ở giai đoạn cao là làm theo năng lực, hưởng theo _____',
    answer: 'NHU CẦU',
    letters: ['N', 'H', 'U', 'C', 'Ầ', 'U'],
    hint: 'Đặc trưng của chủ nghĩa cộng sản hoàn chỉnh',
  },
  {
    question: 'Việt Nam đi lên chủ nghĩa xã hội theo con đường quá độ _____',
    answer: 'GIÁN TIẾP',
    letters: ['G', 'I', 'Á', 'N', 'T', 'I', 'Ế', 'P'],
    hint: 'Không trải qua TBCN với tư cách hình thái thống trị',
  },
];

