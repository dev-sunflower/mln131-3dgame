'use client';

import { ReactNode } from 'react';

interface MiniGameShellProps {
  title: string;
  titleVi: string;
  instructions: string;
  instructionsVi: string;
  color: string;
  onClose: () => void;
  children: ReactNode;
}

export function MiniGameShell({
  title,
  titleVi,
  instructions,
  instructionsVi,
  color,
  onClose,
  children,
}: MiniGameShellProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div
        className="bg-gradient-to-br from-gray-900 to-black border-2 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        style={{ borderColor: color }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-display mb-1" style={{ color }}>
              {titleVi}
            </h2>
            <h3 className="text-lg font-display text-white/70">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl leading-none px-2"
          >
            ×
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-6 text-sm">
          <p className="text-white/90 mb-1">{instructionsVi}</p>
          <p className="text-white/60">{instructions}</p>
        </div>

        {/* Game content */}
        {children}
      </div>
    </div>
  );
}
