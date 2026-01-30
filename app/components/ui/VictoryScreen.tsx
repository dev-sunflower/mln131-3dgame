'use client';

import { motion } from 'framer-motion';
import { Star, Award, GraduationCap, Globe, RotateCcw } from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';

export function VictoryScreen() {
  const { language } = useGameState();

  const content = {
    en: {
      title: 'CONGRATULATIONS!',
      subtitle: 'CHÚC MỪNG BẠN!', // Keep subtitle as a stylistic choice or translate? Let's translate it properly or remove.
      // Actually, let's make it consistent.
      title_main: 'CONGRATULATIONS!',
      title_sub: 'You have completed the journey',
      description: 'You have successfully navigated the mysteries of social evolution and unlocked the path to Communist Society!',
      detail: 'As an FPT Student, you now understand the great transition. Armed with knowledge of digital transformation, innovation, and social justice, you are ready to build the future.',
      badges: {
        theorist: 'THEORIST',
        pioneer: 'PIONEER',
        citizen: 'CITIZEN'
      },
      button: 'PLAY AGAIN'
    },
    vi: {
      title_main: 'CHÚC MỪNG BẠN!',
      title_sub: 'Bạn đã hoàn thành hành trình',
      description: 'Bạn đã xuất sắc vượt qua những bí ẩn của sự tiến hóa xã hội và mở ra con đường đến với Xã hội Cộng sản!',
      detail: 'Là một sinh viên FPT, bạn đã thấu hiểu cuộc chuyển đổi vĩ đại. Được trang bị kiến thức về chuyển đổi số, đổi mới sáng tạo và công bằng xã hội, bạn đã sẵn sàng kiến tạo tương lai.',
      badges: {
        theorist: 'NHÀ LÝ LUẬN',
        pioneer: 'NGƯỜI TIÊN PHONG',
        citizen: 'CÔNG DÂN'
      },
      button: 'CHƠI LẠI'
    }
  };

  const t = content[language];

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
      <div className="vignette" />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brass-gold rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100,
            }}
            animate={{
              y: -100,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: 'spring' }}
        className="text-center max-w-3xl p-8 relative z-10"
      >
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-brass-gold to-brass-dark flex items-center justify-center shadow-[0_0_50px_rgba(181,137,74,0.5)]">
            <Star className="w-16 h-16 text-[#0a0a0f]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-display font-bold text-brass-gold mb-4 tracking-widest"
          style={{ textShadow: '0 0 20px rgba(181, 137, 74, 0.5)' }}
        >
          {t.title_main}
        </motion.h1>

        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-2xl text-parchment font-display mb-6 italic"
        >
          {t.title_sub}
        </motion.p>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="p-8 bg-black/50 border border-brass-gold/30 rounded-lg backdrop-blur-sm mb-8"
        >
          <p className="text-parchment text-lg mb-4 leading-relaxed">
            {t.description.split('Communist Society').length > 1 ? (
              <>
                {t.description.split('Communist Society')[0]}
                <span className="text-brass-gold font-bold">Communist Society</span>
                {t.description.split('Communist Society')[1]}
              </>
            ) : t.description.split('Xã hội Cộng sản').length > 1 ? (
              <>
                {t.description.split('Xã hội Cộng sản')[0]}
                <span className="text-brass-gold font-bold">Xã hội Cộng sản</span>
                {t.description.split('Xã hội Cộng sản')[1]}
              </>
            ) : (
              t.description
            )}
          </p>
          <p className="mt-6 text-gray-300 text-sm leading-relaxed">
            {t.detail}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex justify-center gap-6"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-brass-gold/10 border border-brass-gold/30 rounded-full">
              <Award className="w-6 h-6 text-brass-gold" />
            </div>
            <span className="text-brass-gold text-xs font-display">{t.badges.theorist}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-brass-gold/10 border border-brass-gold/30 rounded-full">
              <GraduationCap className="w-6 h-6 text-brass-gold" />
            </div>
            <span className="text-brass-gold text-xs font-display">{t.badges.pioneer}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-brass-gold/10 border border-brass-gold/30 rounded-full">
              <Globe className="w-6 h-6 text-brass-gold" />
            </div>
            <span className="text-brass-gold text-xs font-display">{t.badges.citizen}</span>
          </div>
        </motion.div>

        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
          onClick={() => window.location.reload()}
          className="mt-12 px-8 py-3 border border-brass-gold text-brass-gold font-display tracking-widest hover:bg-brass-gold/20 transition-all flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          {t.button}
        </motion.button>
      </motion.div>
    </div>
  );
}
