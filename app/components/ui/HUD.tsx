'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  HelpCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';

export function HUD() {
  const {
    currentRoom,
    roomsCompleted,
    soundEnabled,
    toggleSound,
    toggleHint,
    toggleSidebar,
    setCurrentRoom,
    setTransitioning,
    isTransitioning,
    resetRoom,
    examineMode,
    exitExamineMode,
    language,
    setLanguage,
  } = useGameState();

  const roomNames = [
    { en: 'The Antique Study', vi: 'Phòng Nghiên Cứu Cổ' },
    { en: 'The Clockwork Chamber', vi: 'Phòng Cơ Khí' },
    { en: 'The Innovation Workshop', vi: 'Xưởng Đổi Mới' },
  ];

  const roomDescriptions = [
    { en: 'Solve the puzzle box to discover the foundations', vi: 'Giải hộp câu đố để khám phá nền tảng' },
    { en: 'Place the gears to activate the orrery', vi: 'Đặt bánh răng để kích hoạt thiên cầu' },
    { en: 'Assemble the device to power innovation', vi: 'Lắp ráp thiết bị để thúc đẩy đổi mới' },
  ];

  // Handle ESC key to exit examine mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && examineMode) {
        exitExamineMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [examineMode, exitExamineMode]);

  // Navigate to next/previous room
  const navigateRoom = (direction: 'prev' | 'next') => {
    if (isTransitioning) return;

    const newRoom = direction === 'next'
      ? Math.min(currentRoom + 1, 2)
      : Math.max(currentRoom - 1, 0);

    if (newRoom === currentRoom) return;

    // Can only go forward if current room is complete
    if (direction === 'next' && !roomsCompleted[currentRoom]) return;

    setTransitioning(true);
    setTimeout(() => {
      setCurrentRoom(newRoom);
      setTransitioning(false);
    }, 500);
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-display font-bold text-brass-gold tracking-wider">
            {language === 'en' ? 'THE GREAT TRANSITION' : 'CUỘC CHUYỂN ĐỔI VĨ ĐẠI'}
          </h1>

          {/* Room progress indicators */}
          <div className="flex gap-2">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  roomsCompleted[idx]
                    ? 'bg-green-500 shadow-[0_0_10px_#00ff88]'
                    : currentRoom === idx
                      ? 'bg-brass-gold shadow-[0_0_10px_#b5894a]'
                      : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
            className="p-2 hover:bg-white/10 rounded transition-colors flex items-center gap-1 border border-transparent hover:border-brass-gold/30"
            title="Switch Language"
          >
            <Globe className="w-5 h-5 text-brass-gold" />
            <span className="text-xs font-display text-brass-gold w-6 text-center">
              {language.toUpperCase()}
            </span>
          </button>

          <button
            onClick={toggleHint}
            className="p-2 hover:bg-white/10 rounded transition-colors"
            title={language === 'en' ? 'Hint' : 'Gợi ý'}
          >
            <HelpCircle className="w-5 h-5 text-brass-gold" />
          </button>

          <button
            onClick={() => resetRoom(currentRoom)}
            className="p-2 hover:bg-white/10 rounded transition-colors"
            title={language === 'en' ? 'Reset Room' : 'Đặt lại phòng'}
          >
            <RotateCcw className="w-5 h-5 text-brass-gold" />
          </button>

          <button
            onClick={toggleSound}
            className="p-2 hover:bg-white/10 rounded transition-colors"
            title={soundEnabled ? (language === 'en' ? 'Mute' : 'Tắt tiếng') : (language === 'en' ? 'Unmute' : 'Bật tiếng')}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-brass-gold" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-500" />
            )}
          </button>

          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-white/10 rounded transition-colors"
            title={language === 'en' ? 'Knowledge Base' : 'Kho tàng kiến thức'}
          >
            <BookOpen className="w-5 h-5 text-brass-gold" />
          </button>
        </div>
      </header>

      {/* Room Info Panel */}
      <motion.div
        key={currentRoom}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed top-20 left-4 z-30 p-4 bg-black/70 backdrop-blur-sm border border-brass-gold/30 rounded-lg max-w-xs"
      >
        <div className="text-brass-gold font-display text-sm mb-1">
          {language === 'en' ? `ROOM ${currentRoom + 1} / 3` : `PHÒNG ${currentRoom + 1} / 3`}
        </div>
        <div className="text-parchment font-bold mb-2">
          {language === 'en' ? roomNames[currentRoom].en : roomNames[currentRoom].vi}
        </div>
        <div className="text-gray-400 text-sm">
          {language === 'en' ? roomDescriptions[currentRoom].en : roomDescriptions[currentRoom].vi}
        </div>
      </motion.div>

      {/* Navigation Controls */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-4 items-center">
        {/* Previous button */}
        <button
          onClick={() => navigateRoom('prev')}
          disabled={currentRoom === 0 || isTransitioning}
          className={`p-3 rounded-lg border transition-all ${
            currentRoom === 0
              ? 'border-gray-700 text-gray-700 cursor-not-allowed'
              : 'border-brass-gold text-brass-gold hover:bg-brass-gold/20'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Room selectors */}
        <div className="flex items-center gap-2 px-4">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => {
                if (idx <= currentRoom || (idx > 0 && roomsCompleted[idx - 1])) {
                  setTransitioning(true);
                  setTimeout(() => {
                    setCurrentRoom(idx);
                    setTransitioning(false);
                  }, 500);
                }
              }}
              className={`w-10 h-10 rounded-lg border font-display text-sm transition-all ${
                currentRoom === idx
                  ? 'border-brass-gold bg-brass-gold/20 text-brass-gold'
                  : roomsCompleted[idx]
                    ? 'border-green-500 bg-green-500/20 text-green-500'
                    : 'border-gray-600 text-gray-600 cursor-not-allowed'
              }`}
              disabled={idx > currentRoom && !roomsCompleted[idx - 1]}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => navigateRoom('next')}
          disabled={currentRoom === 2 || !roomsCompleted[currentRoom] || isTransitioning}
          className={`p-3 rounded-lg border transition-all ${
            currentRoom === 2 || !roomsCompleted[currentRoom]
              ? 'border-gray-700 text-gray-700 cursor-not-allowed'
              : 'border-brass-gold text-brass-gold hover:bg-brass-gold/20'
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Examine mode indicator */}
      {examineMode && (
        <div className="fixed top-20 right-4 z-30 px-4 py-2 bg-brass-gold/20 border border-brass-gold rounded-lg">
          <span className="text-brass-gold font-display text-sm">
            {language === 'en' 
              ? 'EXAMINE MODE - Drag to rotate, scroll to zoom' 
              : 'CHẾ ĐỘ SOI - Kéo để xoay, lăn chuột để phóng to'}
          </span>
        </div>
      )}
    </>
  );
}
