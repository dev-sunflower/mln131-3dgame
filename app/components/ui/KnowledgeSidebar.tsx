'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Unlock } from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';

export function KnowledgeSidebar() {
  const {
    sidebarOpen,
    toggleSidebar,
    knowledge,
    selectedKnowledge,
    setSelectedKnowledge,
    language,
  } = useGameState();

  const foundCount = knowledge.filter((k) => k.found).length;

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed right-0 top-0 bottom-0 w-96 bg-[#0a0808]/95 backdrop-blur-md border-l border-brass-gold/30 z-50 overflow-y-auto"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display text-brass-gold tracking-wider">
                KNOWLEDGE BASE
              </h2>
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* Knowledge items */}
            <div className="space-y-4">
              {knowledge.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  onClick={() =>
                    setSelectedKnowledge(
                      selectedKnowledge?.id === item.id ? null : item
                    )
                  }
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    item.found
                      ? selectedKnowledge?.id === item.id
                        ? 'border-brass-gold bg-brass-gold/10'
                        : 'border-brass-gold/30 bg-black/50 hover:border-brass-gold/60'
                      : 'border-gray-700 bg-gray-900/50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {item.found ? (
                      <Unlock className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-600" />
                    )}
                    <h3
                      className={`font-display text-sm ${
                        item.found ? 'text-parchment' : 'text-gray-400'
                      }`}
                    >
                      {language === 'vi' ? item.titleVi : item.title}
                    </h3>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {item.found && selectedKnowledge?.id === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <p className="text-sm text-gray-300 mb-2">
                            {language === 'vi' ? item.contentVi : item.content}
                          </p>
                          {language === 'en' && (
                            <p className="text-xs text-gray-400 italic">
                              {item.contentVi}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-8 p-4 bg-black/50 border border-brass-gold/30 rounded-lg">
              <h3 className="font-display text-sm text-brass-gold mb-3 tracking-wider">
                PROGRESS
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 bg-gray-800 rounded overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brass-gold to-amber-500"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(foundCount / knowledge.length) * 100}%`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-sm text-gray-300">
                  {foundCount}/{knowledge.length}
                </span>
              </div>
              <p className="text-xs text-gray-300">Knowledge items discovered</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
