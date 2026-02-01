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
    text: "Nhà nước pháp quyền xã hội chủ nghĩa Việt Nam là nhà nước của [0], do [1] và vì [2]. Tất cả quyền lực nhà nước thuộc về [3], với nền tảng là liên minh giữa giai cấp công nhân, nông dân và đội ngũ trí thức.",
    blanks: ["Nhân dân", "Nhân dân", "Nhân dân", "Nhân dân"],
  },
  {
    id: 2,
    text: "Hiến pháp là [0] của nước Cộng hòa xã hội chủ nghĩa Việt Nam. Quyền [1] thuộc về Quốc hội, quyền [2] thuộc về Chính phủ, và quyền [3] thuộc về Tòa án nhân dân.",
    blanks: ["luật cơ bản", "lập pháp", "hành pháp", "tư pháp"],
  },
  {
    id: 3,
    text: "Mọi công dân đều [0] trước pháp luật, không ai bị [1] đối xử trong đời sống chính trị, kinh tế, văn hóa, xã hội. Công dân có quyền [2] khi đủ 18 tuổi và quyền [3] khi đủ 21 tuổi.",
    blanks: ["bình đẳng", "phân biệt", "bầu cử", "ứng cử"],
  },
  {
    id: 4,
    text: "Đảng Cộng sản Việt Nam là [0] lãnh đạo Nhà nước và xã hội. Đảng hoạt động theo nguyên tắc [1]. Mặt trận Tổ quốc Việt Nam là tổ chức đại diện cho [2] toàn dân tộc.",
    blanks: ["lực lượng", "tập trung dân chủ", "khối đại đoàn kết"],
  },
  {
    id: 5,
    text: "[0] là giá trị cốt lõi của nền tư pháp. Nguyên tắc [1] đảm bảo rằng một người chỉ bị coi là có tội khi có [2] của Tòa án. Luật sư có vai trò [3] quyền và lợi ích hợp pháp của thân chủ.",
    blanks: ["Công lý", "suy đoán vô tội", "bản án", "bảo vệ"],
  },
];
