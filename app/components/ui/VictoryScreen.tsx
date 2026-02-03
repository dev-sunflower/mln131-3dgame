'use client';

import { motion } from 'framer-motion';
import { Star, Award, GraduationCap, Globe, RotateCcw, Sparkles } from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';

export function VictoryScreen() {
  const { language } = useGameState();

  const content = {
    en: {
      title_main: 'VICTORY!',
      title_sub: 'You have completed the journey through socialism',
      description: 'You have successfully learned about socialist theory, the transition period, and how to apply these principles to modern innovation!',
      detail: 'As an FPT Student, you now understand the great transition. Armed with knowledge of Marxist theory, socialist principles, digital transformation, and social justice, you are ready to build a better future.',
      badges: {
        theorist: 'MARXIST SCHOLAR',
        pioneer: 'SOCIALIST PIONEER',
        citizen: 'FUTURE BUILDER'
      },
      button: 'PLAY AGAIN',
      stats: 'Achievements Unlocked'
    },
    vi: {
      title_main: 'CHIẾN THẮNG!',
      title_sub: 'Bạn đã hoàn thành hành trình tìm hiểu chủ nghĩa xã hội',
      description: 'Bạn đã xuất sắc học về lý thuyết xã hội chủ nghĩa, thời kỳ quá độ, và cách áp dụng những nguyên lý này vào đổi mới hiện đại!',
      detail: 'Là sinh viên FPT, bạn đã thấu hiểu cuộc chuyển đổi vĩ đại. Được trang bị kiến thức về lý thuyết Mác-xít, nguyên lý xã hội chủ nghĩa, chuyển đổi số và công bằng xã hội, bạn sẵn sàng xây dựng tương lai tốt đẹp hơn.',
      badges: {
        theorist: 'NHÀ HỌC GIẢ MÁC-XÍT',
        pioneer: 'NGƯỜI TIÊN PHONG XHCN',
        citizen: 'NGƯỜI XÂY DỰNG TƯƠNG LAI'
      },
      button: 'CHƠI LẠI',
      stats: 'Thành tựu đã mở khóa'
    }
  };

  const t = content[language];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-red-950 via-black to-black flex items-center justify-center overflow-hidden">
      {/* Animated background rays */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`ray-${i}`}
            className="absolute top-1/2 left-1/2 w-2 h-full bg-gradient-to-b from-red-500/20 via-yellow-500/10 to-transparent origin-top"
            style={{
              transform: `rotate(${i * 30}deg)`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scaleY: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Floating stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              scale: 0,
              rotate: 0,
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: 360,
              y: [null, Math.random() * 200 - 100],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut'
            }}
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" style={{ filter: 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.8))' }} />
          </motion.div>
        ))}
      </div>

      {/* Sparkle particles rising from bottom */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50,
              scale: 0,
            }}
            animate={{
              y: -100,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              scale: [0, 1, 0.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeOut'
            }}
          >
            <Sparkles className="w-3 h-3 text-red-400" style={{ filter: 'drop-shadow(0 0 4px rgba(248, 113, 113, 0.8))' }} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: 'spring', bounce: 0.5 }}
        className="text-center max-w-4xl p-8 relative z-10"
      >
        {/* Main star icon with pulsing glow */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
          }}
          transition={{ 
            duration: 1.5, 
            type: 'spring',
            bounce: 0.6 
          }}
          className="mb-8 relative"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute inset-0 w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-yellow-400/50 to-red-600/50 blur-3xl"
          />
          <div className="relative w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-yellow-500 via-red-500 to-red-700 flex items-center justify-center shadow-[0_0_80px_rgba(234,179,8,0.8)]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Star className="w-20 h-20 text-white fill-white" style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' }} />
            </motion.div>
          </div>
        </motion.div>

        {/* Title with glowing effect */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-red-600 mb-4 tracking-widest"
          style={{ 
            textShadow: '0 0 40px rgba(234, 179, 8, 0.8), 0 0 80px rgba(220, 38, 38, 0.5)',
            WebkitTextStroke: '2px rgba(255, 255, 255, 0.1)'
          }}
        >
          {t.title_main}
        </motion.h1>

        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-2xl text-yellow-200 font-display mb-8 italic"
          style={{ textShadow: '0 0 20px rgba(254, 240, 138, 0.5)' }}
        >
          {t.title_sub}
        </motion.p>

        {/* Content box with enhanced styling */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="relative p-8 bg-gradient-to-br from-red-900/60 via-black/80 to-red-950/60 border-2 border-red-500 rounded-xl backdrop-blur-sm mb-8 shadow-[0_0_50px_rgba(220,38,38,0.4)]"
        >
          {/* Animated corner stars */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-4 -left-4"
          >
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-4 -right-4"
          >
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-4 -left-4"
          >
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-4 -right-4"
          >
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          </motion.div>

          <p className="text-red-100 text-lg mb-4 leading-relaxed font-semibold">
            {t.description}
          </p>
          <p className="mt-6 text-red-200/90 text-base leading-relaxed">
            {t.detail}
          </p>
        </motion.div>

        {/* Achievement badges with stagger animation */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mb-6"
        >
          <p className="text-yellow-400 font-display text-lg mb-6 font-bold tracking-wider" style={{ textShadow: '0 0 20px rgba(250, 204, 21, 0.5)' }}>
            ★ {t.stats} ★
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex justify-center gap-8 mb-10"
        >
          {[
            { icon: Award, label: t.badges.theorist, color: 'red', delay: 0 },
            { icon: GraduationCap, label: t.badges.pioneer, color: 'yellow', delay: 0.2 },
            { icon: Globe, label: t.badges.citizen, color: 'red', delay: 0.4 }
          ].map((badge, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 1.3 + badge.delay, 
                type: 'spring',
                bounce: 0.6
              }}
              className="flex flex-col items-center gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className={`relative p-6 bg-gradient-to-br ${
                  badge.color === 'yellow' 
                    ? 'from-yellow-600 to-yellow-700' 
                    : 'from-red-600 to-red-700'
                } border-2 ${
                  badge.color === 'yellow' 
                    ? 'border-yellow-400' 
                    : 'border-red-400'
                } rounded-full cursor-pointer transition-all shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:shadow-[0_0_50px_rgba(250,204,21,0.8)]`}
              >
                <badge.icon className="w-10 h-10 text-white" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }} />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-white"
                />
              </motion.div>
              <span className={`${
                badge.color === 'yellow' ? 'text-yellow-300' : 'text-red-300'
              } text-sm font-display text-center max-w-[120px] font-bold tracking-wide`}>
                {badge.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Play again button with enhanced styling */}
        <motion.button
          initial={{ y: 50, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, type: 'spring', bounce: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="relative mt-4 px-12 py-5 bg-gradient-to-r from-yellow-600 via-red-600 to-red-700 border-4 border-yellow-400 text-white font-display text-xl font-black tracking-widest shadow-[0_0_40px_rgba(250,204,21,0.6)] hover:shadow-[0_0_60px_rgba(250,204,21,0.9)] transition-all flex items-center gap-4 mx-auto rounded-xl overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <RotateCcw className="w-6 h-6" />
          </motion.div>
          <span>{t.button}</span>
          
          {/* Button shine effect */}
          <motion.div
            animate={{ x: [-200, 400] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="absolute inset-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
          />
        </motion.button>
      </motion.div>
    </div>
  );
}