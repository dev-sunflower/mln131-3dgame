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

];
