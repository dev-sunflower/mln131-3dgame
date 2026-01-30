'use client';

import { Game } from './components/Game';

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0a0a0f]">
      <Game />
    </main>
  );
}