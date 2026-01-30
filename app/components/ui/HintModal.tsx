'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';

export function HintModal() {
  const { showHint, toggleHint, currentRoom, language } = useGameState();

  const hints = [
    {
      room: 0,
      title: 'The Antique Study',
      titleVi: 'Phòng Nghiên Cứu Cổ',
      content: [
        'The puzzle box requires aligning symbols representing foundations of socialism.',
        'Objective conditions: Production Factory (gear/factory) and Historical Progress (book).',
        'Subjective conditions: Worker Consciousness (fist) and Justice (scales).',
        'Check the bookshelves for a special red book!',
      ],
      contentVi: [
        'Hộp câu đố yêu cầu căn chỉnh các biểu tượng đại diện cho nền tảng của chủ nghĩa xã hội.',
        'Điều kiện khách quan: Nhà máy sản xuất (bánh răng/nhà máy) và Tiến bộ lịch sử (sách).',
        'Điều kiện chủ quan: Ý thức công nhân (nắm đấm) và Công lý (cái cân).',
        'Kiểm tra kệ sách để tìm một cuốn sách màu đỏ đặc biệt!',
      ],
    },
    {
      room: 1,
      title: 'The Clockwork Chamber',
      titleVi: 'Phòng Cơ Khí',
      content: [
        'Find the four brass gears hidden around the room.',
        'Place each gear in its designated slot on the orrery.',
        'Each gear represents a domain of social transformation during the transition.',
        'When all are correctly placed, the machine will reveal the core.',
      ],
      contentVi: [
        'Tìm bốn bánh răng đồng ẩn xung quanh phòng.',
        'Đặt mỗi bánh răng vào khe được chỉ định trên thiên cầu.',
        'Mỗi bánh răng đại diện cho một lĩnh vực cải tạo xã hội trong thời kỳ quá độ.',
        'Khi tất cả được đặt đúng vị trí, máy sẽ tiết lộ lõi năng lượng.',
      ],
    },
    {
      room: 2,
      title: 'The Innovation Workshop',
      titleVi: 'Xưởng Đổi Mới',
      content: [
        'Collect the three glowing modules: Innovation, Digital, and Justice.',
        'Innovation and Digital modules are on the side tables, Justice is on the high shelf.',
        'Insert all modules into the workbench device to power it up.',
        'Claim your FPT Student ID card to complete your journey.',
      ],
      contentVi: [
        'Thu thập ba mô-đun phát sáng: Đổi mới, Kỹ thuật số và Công lý.',
        'Mô-đun Đổi mới và Kỹ thuật số ở trên bàn cạnh, Công lý ở trên kệ cao.',
        'Lắp tất cả các mô-đun vào thiết bị bàn làm việc để khởi động nó.',
        'Nhận thẻ sinh viên FPT của bạn để hoàn thành hành trình.',
      ],
    },
  ];

  const currentHint = hints[currentRoom];

  return (
    <AnimatePresence>
      {showHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={toggleHint}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full p-8 bg-[#1a1208] border border-brass-gold/50 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] relative"
          >
            <button
              onClick={toggleHint}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-brass-gold" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-8 h-8 text-brass-gold" />
              <div>
                <h3 className="text-xl font-display text-brass-gold tracking-wide">
                  {language === 'vi' ? currentHint.titleVi : currentHint.title}
                </h3>
                <p className="text-gray-300 text-xs uppercase tracking-widest">
                  {language === 'vi' ? `HƯỚNG DẪN PHÒNG ${currentRoom + 1}` : `GUIDANCE FOR ROOM ${currentRoom + 1}`}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {(language === 'vi' ? currentHint.contentVi : currentHint.content).map(
                (text, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brass-gold flex-shrink-0" />
                    <p className="text-parchment leading-relaxed text-sm">
                      {text}
                    </p>
                  </div>
                )
              )}
            </div>

            <button
              onClick={toggleHint}
              className="mt-8 w-full py-3 border border-brass-gold text-brass-gold font-display text-sm tracking-widest hover:bg-brass-gold/20 transition-all"
            >
              {language === 'vi' ? 'ĐÃ HIỂU' : 'I UNDERSTAND'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
