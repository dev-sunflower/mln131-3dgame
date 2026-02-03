'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameState } from '../../../hooks/useGameState';
import { useRoom1UI } from './useRoom1UI';

// Communist Manifesto Book
function ManifestoBook() {
  const bookRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { openQuiz, gameStarted, quizCompleted } = useRoom1UI();
  const { language, obtainRoom1Key } = useGameState();

  useFrame((state) => {
    if (bookRef.current && !quizCompleted) {
      bookRef.current.rotation.y += 0.005;
      const time = state.clock.getElapsedTime();
      bookRef.current.position.y = 1.2 + Math.sin(time * 2) * 0.05;
    }
  });

  const handleClick = () => {
    if (gameStarted && !quizCompleted) {
      openQuiz();
    } else if (quizCompleted) {
      obtainRoom1Key();
    }
  };

  return (
    <group
      ref={bookRef}
      position={[0, 1.2, -1]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Book cover */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.7, 0.1]} />
        <meshStandardMaterial
          color={quizCompleted ? '#00ff00' : '#cc0000'}
          emissive={quizCompleted ? '#00ff00' : '#cc0000'}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Hammer and sickle symbol */}
      <mesh position={[0, 0, 0.06]}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={0.5} />
      </mesh>

      <mesh position={[-0.08, -0.08, 0.06]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.15, 0.03, 0.02]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={0.5} />
      </mesh>

      {/* Glow effect */}
      <pointLight
        position={[0, 0, 0.2]}
        intensity={hovered ? 2 : 1}
        distance={3}
        color={quizCompleted ? '#00ff00' : '#ff0000'}
      />

      {/* Label */}
      {hovered && gameStarted && (
        <Html position={[0, 0.5, 0]} center>
          <div className="text-xs font-display whitespace-nowrap bg-black/90 px-3 py-1 rounded border border-red-500 text-red-400">
            {language === 'en' ? 'Communist Manifesto' : 'Tuyên ngôn Cộng sản'}
          </div>
        </Html>
      )}
    </group>
  );
}

// Red star decorations
function RedStars() {
  return (
    <>
      {[-2, 0, 2].map((x, idx) => (
        <group key={idx} position={[x, 2.5, -2.5]}>
          <mesh rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 5]} />
            <meshStandardMaterial
              color="#cc0000"
              emissive="#cc0000"
              emissiveIntensity={0.5}
              roughness={0.5}
            />
          </mesh>
          <pointLight position={[0, 0, 0.1]} intensity={0.5} distance={2} color="#ff0000" />
        </group>
      ))}
    </>
  );
}

// Red banners
function Banners() {
  return (
    <>
      {/* Back wall banner */}
      <mesh position={[0, 2, -2.95]}>
        <planeGeometry args={[4, 2]} />
        <meshStandardMaterial color="#cc0000" roughness={0.7} />
      </mesh>

      {/* Hammer and sickle on banner */}
      <mesh position={[0, 2.3, -2.94]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={0.3} />
      </mesh>

      <mesh position={[-0.15, 1.9, -2.94]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.35, 0.05, 0.02]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={0.3} />
      </mesh>
    </>
  );
}

// Bookshelves with red books
function Bookshelves() {
  return (
    <group position={[-2.8, 1.5, -1]}>
      {[0, 1, 2].map((shelfIdx) => (
        <group key={shelfIdx} position={[0, shelfIdx * 0.6, 0]}>
          {/* Shelf */}
          <mesh>
            <boxGeometry args={[0.3, 0.05, 1.5]} />
            <meshStandardMaterial color="#2a1810" roughness={0.8} />
          </mesh>
          {/* Books */}
          {[...Array(6)].map((_, bookIdx) => (
            <mesh key={bookIdx} position={[0, 0.15, -0.6 + bookIdx * 0.25]}>
              <boxGeometry args={[0.25, 0.3, 0.2]} />
              <meshStandardMaterial
                color={['#8b0000', '#b22222', '#dc143c'][bookIdx % 3]}
                roughness={0.7}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// Environment
function Room1Environment() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#1a0808" roughness={0.9} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2.5, -3]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#0a0404" roughness={0.95} />
      </mesh>

      <mesh position={[-6, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#0a0404" roughness={0.95} />
      </mesh>

      <mesh position={[6, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#0a0404" roughness={0.95} />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 3, -2]} intensity={0.8} color="#ff0000" />
      <pointLight position={[-2, 2, 0]} intensity={0.5} color="#ffcc00" />
      <pointLight position={[2, 2, 0]} intensity={0.5} color="#ffcc00" />
    </group>
  );
}

// Main Room 1 component
export function Room1() {
  return (
    <group>
      <Room1Environment />
      <ManifestoBook />
      <RedStars />
      <Banners />
      <Bookshelves />
    </group>
  );
}
