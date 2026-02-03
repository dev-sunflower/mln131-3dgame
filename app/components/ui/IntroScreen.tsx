"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Key, Globe } from "lucide-react";
import { useGameState } from "../../hooks/useGameState";

export function IntroScreen() {
  const { startGame, language, setLanguage } = useGameState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const content = {
    en: {
      title: "THE GREAT TRANSITION",
      subtitle: "Socialism and the Path to Communism",
      description:
        "Embark on an educational journey through the principles of Marxist-Leninist theory. Explore three interconnected spaces that reveal the foundations of socialism, the transition period, and the future of innovation in a socialist society.",
      rooms: [
        { name: "Revolutionary Foundation", sub: "Marxist Theory", icon: "📚" },
        { name: "Socialist Theory", sub: "Transition Period", icon: "⚙️" },
        { name: "Innovation & Future", sub: "Modern Application", icon: "🚀" },
      ],
      button: "BEGIN YOUR JOURNEY",
      hint: "Click on glowing objects to interact. Complete mini-games to unlock knowledge.",
      mission: "Learn about socialism through interactive challenges and unlock the path forward!"
    },
    vi: {
      title: "CUỘC CHUYỂN ĐỔI VĨ ĐẠI",
      subtitle: "Chủ nghĩa Xã hội và Con đường lên Chủ nghĩa Cộng sản",
      description:
        "Khởi hành một hành trình giáo dục qua các nguyên lý lý thuyết Mác-Lênin. Khám phá ba không gian kết nối với nhau, tiết lộ nền tảng của chủ nghĩa xã hội, thời kỳ quá độ, và tương lai đổi mới trong xã hội xã hội chủ nghĩa.",
      rooms: [
        { name: "Nền Tảng Cách Mạng", sub: "Lý thuyết Mác-xít", icon: "📚" },
        { name: "Lý Thuyết Xã Hội", sub: "Thời kỳ Quá độ", icon: "⚙️" },
        { name: "Đổi Mới & Tương Lai", sub: "Ứng dụng Hiện đại", icon: "🚀" },
      ],
      button: "BẮT ĐẦU HÀNH TRÌNH",
      hint: "Nhấn vào các vật thể phát sáng để tương tác. Hoàn thành mini-game để mở khóa kiến thức.",
      mission: "Học về chủ nghĩa xã hội qua các thử thách tương tác và mở khóa con đường tiến lên!"
    },
  };

  const t = content[language];

  return (
    <div className="fixed inset-0 bg-[#050508] flex items-center justify-center">
      {/* Vignette */}
      <div className="vignette" />

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setLanguage(language === "en" ? "vi" : "en")}
          className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-brass-gold/30 rounded-lg hover:bg-brass-gold/10 hover:border-brass-gold transition-all group"
        >
          <Globe className="w-5 h-5 text-brass-gold group-hover:rotate-12 transition-transform" />
          <span className="text-brass-gold font-display text-sm">{language === "en" ? "ENGLISH" : "TIẾNG VIỆT"}</span>
        </button>
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted &&
          [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-brass-gold/30 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
              }}
              animate={{
                y: [null, Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000)],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center max-w-2xl p-8 relative z-10"
      >
        {/* Lock icon */}
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Lock className="w-20 h-20 mx-auto mb-6 text-brass-gold" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-display font-bold text-brass-gold mb-4 tracking-wider"
          style={{
            textShadow: "0 0 20px rgba(181, 137, 74, 0.5)",
          }}
        >
          {t.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xl text-parchment mb-2 font-display tracking-wide"
        >
          {t.subtitle}
        </motion.p>

        {/* Description box */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 p-6 bg-black/50 border border-brass-gold/30 rounded-lg backdrop-blur-sm"
        >
          <p className="text-parchment leading-relaxed">{t.description}</p>
        </motion.div>

        {/* Room preview */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {t.rooms.map((room, idx) => (
            <div key={idx} className="p-4 border border-brass-gold/30 rounded bg-black/30 hover:bg-black/40 transition-all">
              <div className="text-4xl mb-2">{room.icon}</div>
              <div className="text-brass-gold font-display text-sm mb-1">
                {language === "en" ? `ROOM ${idx + 1}` : `PHÒNG ${idx + 1}`}
              </div>
              <div className="text-parchment text-sm font-bold">{room.name}</div>
              <div className="text-gray-400 text-xs mt-1">{room.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* Mission statement */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 p-4 bg-red-900/20 border border-red-600/30 rounded-lg"
        >
          <p className="text-red-400 text-sm font-display">{t.mission}</p>
        </motion.div>

        {/* Start button */}
        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
          onClick={startGame}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-red-800 to-red-600 border-2 border-red-500 text-white font-display text-lg tracking-widest rounded-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
        >
          <Key className="w-5 h-5" />
          {t.button}
        </motion.button>

        {/* Controls hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 text-gray-400 text-sm"
        >
          {t.hint}
        </motion.p>
      </motion.div>
    </div>
  );
}
