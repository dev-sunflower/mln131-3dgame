'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Key, Cog, Package } from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  key: Key,
  cog: Cog,
  default: Package,
};

export function Inventory() {
  const { inventory, selectedItem, selectInventoryItem, language } = useGameState();

  if (inventory.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-4 z-30">
      <div className="bg-black/70 backdrop-blur-sm border border-brass-gold/30 rounded-lg p-3">
        <div className="text-brass-gold font-display text-xs mb-2 tracking-wider">
          INVENTORY
        </div>

        <div className="flex gap-2">
          <AnimatePresence>
            {inventory.map((item) => {
              const Icon = iconMap[item.icon] || iconMap.default;
              const isSelected = selectedItem === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => selectInventoryItem(isSelected ? null : item.id)}
                  className={`relative w-14 h-14 rounded-lg border cursor-pointer transition-all flex items-center justify-center ${
                    isSelected
                      ? 'border-brass-gold bg-brass-gold/20 shadow-[0_0_15px_rgba(181,137,74,0.5)]'
                      : 'border-brass-gold/50 bg-black/50 hover:border-brass-gold'
                  }`}
                  title={language === 'vi' ? item.nameVi : item.name}
                >
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-brass-gold' : 'text-brass-gold/70'}`} />

                  {/* Item name tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-black/90 text-brass-gold text-xs px-2 py-1 rounded whitespace-nowrap font-display">
                      {language === 'vi' ? item.nameVi : item.name}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs text-gray-400"
          >
            {inventory.find((i) => i.id === selectedItem)?.description}
          </motion.div>
        )}
      </div>
    </div>
  );
}
