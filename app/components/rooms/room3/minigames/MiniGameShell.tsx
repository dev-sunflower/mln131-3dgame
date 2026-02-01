'use client';

import { ReactNode } from 'react';

interface MiniGameShellProps {
  title: string;
  color: string;
  onClose: () => void;
  children: ReactNode;
}

// Reusable shell for all mini-games - pure DOM, no drei
export function MiniGameShell({ title, color, onClose, children }: MiniGameShellProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-gray-900 border-2 rounded-lg p-6 max-w-md w-full mx-4"
        style={{ borderColor: color }}
      >
        <h2 className="text-2xl font-display mb-4" style={{ color }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
