export interface JusticeParagraph {
  id: number;
  // The paragraph text with placeholders like [0], [1], etc.
  text: string;
  // The words that need to be filled in, in order of [0], [1], [2]...
  blanks: string[];
}

export const justiceParagraphs: JusticeParagraph[] = [
  {
    id: 1,
    text: "Chủ nghĩa xã hội vừa là [0] đấu tranh thực tiễn của nhân dân lao động chống áp bức, vừa là [1] tư tưởng và lý luận phản ánh lý tưởng giải phóng con người khỏi [2].",
    blanks: ["phong trào", "trào lưu", "bất công"],
  },
  {
    id: 2,
    text: "Theo quan điểm Mác – Lênin, chủ nghĩa xã hội là [0] của hình thái kinh tế – xã hội [1] chủ nghĩa, giữ vị trí đặc biệt trong tiến trình phát triển lịch sử nhân loại.",
    blanks: ["giai đoạn đầu", "cộng sản"],
  },
  {
    id: 3,
    text: "Lịch sử nhân loại phát triển tuần tự qua các hình thái kinh tế – xã hội từ [0] đến [1], trong đó chủ nghĩa tư bản dựa trên sở hữu [2] và lao động [3].",
    blanks: ["thấp", "cao", "tư bản", "làm thuê"],
  },
  {
    id: 4,
    text: "Chủ nghĩa xã hội xuất hiện khi chủ nghĩa [0] phát triển đến một trình độ nhất định, khi sự [1] bộc lộ gay gắt, thúc đẩy người lao động đấu tranh để được [2].",
    blanks: ["tư bản", "bóc lột", "giải phóng"],
  },
  {
    id: 5,
    text: "Trong hình thái kinh tế – xã hội cộng sản chủ nghĩa, giai đoạn [0] là chủ nghĩa xã hội, đóng vai trò [1] để tiến tới giai đoạn [2] là chủ nghĩa cộng sản [3].",
    blanks: ["thấp", "bước đệm", "cao", "hoàn chỉnh"],
  },

];
