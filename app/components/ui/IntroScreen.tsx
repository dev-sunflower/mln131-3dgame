'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Key } from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';

export function IntroScreen() {
  const { startGame } = useGameState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#050508] flex items-center justify-center">
      {/* Vignette */}
      <div className="vignette" />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brass-gold/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: 'easeInOut',
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
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Lock className="w-20 h-20 mx-auto mb-6 text-brass-gold" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-display font-bold text-brass-gold mb-4 tracking-wider"
          style={{
            textShadow: '0 0 20px rgba(181, 137, 74, 0.5)',
          }}
        >
          THE GREAT TRANSITION
        </motion.h1>

        {/* Vietnamese subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xl text-gray-400 mb-2 font-display tracking-wide"
        >
          CUỘC CHUYỂN ĐỔI VĨ ĐẠI
        </motion.p>

        {/* Description box */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 p-6 bg-black/50 border border-brass-gold/30 rounded-lg backdrop-blur-sm"
        >
          <p className="text-parchment mb-4 leading-relaxed">
            You find yourself in a mysterious Victorian mansion containing ancient
            secrets of humanity&apos;s social evolution. Examine the intricate puzzle
            boxes and mechanisms to understand the path from Capitalism to Communism.
          </p>
          <p className="text-gray-500 text-sm italic">
            Bạn đang ở trong một dinh thự Victoria bí ẩn chứa đựng những bí mật cổ
            xưa về sự tiến hóa xã hội của nhân loại. Khám phá các hộp câu đố và cơ
            chế tinh xảo để hiểu con đường từ Chủ nghĩa Tư bản đến Chủ nghĩa Cộng sản.
          </p>
        </motion.div>

        {/* Room preview */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { name: 'The Antique Study', vi: 'Phòng Nghiên Cứu' },
            { name: 'The Clockwork Chamber', vi: 'Phòng Cơ Khí' },
            { name: 'The Innovation Workshop', vi: 'Xưởng Đổi Mới' },
          ].map((room, idx) => (
            <div
              key={idx}
              className="p-4 border border-brass-gold/30 rounded bg-black/30"
            >
              <div className="text-brass-gold font-display text-sm mb-1">
                ROOM {idx + 1}
              </div>
              <div className="text-parchment text-sm">{room.name}</div>
              <div className="text-gray-500 text-xs mt-1">{room.vi}</div>
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
          BEGIN EXPLORATION
        </motion.button>

        {/* Controls hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 text-gray-500 text-sm"
        >
          Click objects to examine them. Drag to rotate. Scroll to zoom.
        </motion.p>
      </motion.div>
    </div>
  );
}
