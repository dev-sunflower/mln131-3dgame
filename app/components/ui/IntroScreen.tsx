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
      subtitle: "The Journey from Capitalism to Communism",
      description:
        "You find yourself in a mysterious Victorian mansion containing ancient secrets of humanity's social evolution. Examine the intricate puzzle boxes and mechanisms to understand the path from Capitalism to Communism.",
      rooms: [
        { name: "The Antique Study", sub: "Foundations" },
        { name: "The Clockwork Chamber", sub: "Transition" },
        { name: "The Innovation Workshop", sub: "Future" },
      ],
      button: "BEGIN EXPLORATION",
      hint: "Click objects to examine them. Drag to rotate. Scroll to zoom.",
    },
    vi: {
      title: "CUỘC CHUYỂN ĐỔI VĨ ĐẠI",
      subtitle: "Hành trình từ Tư bản chủ nghĩa đến Cộng sản chủ nghĩa",
      description:
        "Bạn đang ở trong một dinh thự Victoria bí ẩn chứa đựng những bí mật cổ xưa về sự tiến hóa xã hội của nhân loại. Khám phá các hộp câu đố và cơ chế tinh xảo để hiểu con đường từ Chủ nghĩa Tư bản đến Chủ nghĩa Cộng sản.",
      rooms: [
        { name: "Phòng Nghiên Cứu Cổ", sub: "Nền Tảng" },
        { name: "Phòng Cơ Khí", sub: "Quá Độ" },
        { name: "Xưởng Đổi Mới", sub: "Tương Lai" },
      ],
      button: "BẮT ĐẦU KHÁM PHÁ",
      hint: "Nhấn vào vật thể để soi. Kéo để xoay. Lăn chuột để phóng to.",
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
            <div key={idx} className="p-4 border border-brass-gold/30 rounded bg-black/30">
              <div className="text-brass-gold font-display text-sm mb-1">
                {language === "en" ? `ROOM ${idx + 1}` : `PHÒNG ${idx + 1}`}
              </div>
              <div className="text-parchment text-sm">{room.name}</div>
              <div className="text-gray-300 text-xs mt-1">{room.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* Start button */}
        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
          onClick={startGame}
          className="mt-10 px-8 py-4 bg-gradient-to-r from-brass-dark to-brass-gold border border-brass-gold text-[#0a0808] font-display text-lg tracking-widest rounded hover:shadow-[0_0_30px_rgba(181,137,74,0.5)] transition-all duration-300 flex items-center gap-3 mx-auto"
        >
          <Key className="w-5 h-5" />
          {t.button}
        </motion.button>

        {/* Controls hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 text-gray-300 text-sm"
        >
          {t.hint}
        </motion.p>
      </motion.div>
    </div>
  );
}
