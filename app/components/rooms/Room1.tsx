'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameState } from '../../hooks/useGameState';

// Dial symbols for the puzzle
const dialSymbols = [
  ['⚙️', '📈', '🏭', '⚡'], // Dial 0 - Production/Economy
  ['👷', '✊', '🔥', '⭐'], // Dial 1 - Workers/Revolution
  ['📖', '🎓', '💡', '🗳️'], // Dial 2 - Knowledge/Politics
  ['🌍', '🤝', '⚖️', '🏛️'], // Dial 3 - Society/Justice
];

// Correct positions for the puzzle
const correctPositions = [2, 1, 0, 2]; // Factory, Fist, Book, Justice

// Puzzle Box component
function PuzzleBox() {
  const {
    examineMode,
    examinedObject,
    enterExamineMode,
    exitExamineMode,
    room1State,
    setDialPosition,
    openBox,
    obtainRoom1Key,
  } = useGameState();

  const boxRef = useRef<THREE.Group>(null);
  const [hoveredDial, setHoveredDial] = useState<number | null>(null);
  const isExamining = examineMode && examinedObject === 'puzzle-box';

  // Check if puzzle is solved
  const isPuzzleSolved = room1State.dialPositions.every(
    (pos, idx) => pos === correctPositions[idx]
  );

  // Handle dial click
  const handleDialClick = (dialIndex: number) => {
    if (!isExamining || room1State.boxOpened) return;

    const newPosition = (room1State.dialPositions[dialIndex] + 1) % 4;
    setDialPosition(dialIndex, newPosition);

    // Check if solved after this move
    const newPositions = [...room1State.dialPositions];
    newPositions[dialIndex] = newPosition;
    const solved = newPositions.every((pos, idx) => pos === correctPositions[idx]);

    if (solved && !room1State.boxOpened) {
      setTimeout(() => {
        openBox();
      }, 500);
    }
  };

  // Handle box click to enter examine mode
  const handleBoxClick = () => {
    if (!examineMode) {
      enterExamineMode('puzzle-box');
    }
  };

  // Handle taking the key
  const handleTakeKey = () => {
    if (room1State.boxOpened && !room1State.keyObtained) {
      obtainRoom1Key();
    }
  };

  return (
    <group
      ref={boxRef}
      position={[0, 1, 0]}
      onClick={handleBoxClick}
    >
      {/* Main box body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.6, 0.8]} />
        <meshStandardMaterial
          color="#4a3020"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Brass trim */}
      <mesh position={[0, 0.31, 0]}>
        <boxGeometry args={[1.25, 0.02, 0.85]} />
        <meshStandardMaterial
          color="#b5894a"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Dials */}
      {[0, 1, 2, 3].map((dialIdx) => {
        const xOffset = (dialIdx - 1.5) * 0.25;
        const rotation = (room1State.dialPositions[dialIdx] * Math.PI) / 2;

        return (
          <group
            key={dialIdx}
            position={[xOffset, 0.32, 0.2]}
            onClick={(e) => {
              e.stopPropagation();
              handleDialClick(dialIdx);
            }}
            onPointerOver={() => setHoveredDial(dialIdx)}
            onPointerOut={() => setHoveredDial(null)}
          >
            {/* Dial base */}
            <mesh rotation={[0, 0, rotation]}>
              <cylinderGeometry args={[0.08, 0.08, 0.05, 32]} />
              <meshStandardMaterial
                color={hoveredDial === dialIdx ? '#d4a84a' : '#8b6914'}
                roughness={0.4}
                metalness={0.8}
                emissive={hoveredDial === dialIdx ? '#8b6914' : '#000000'}
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Dial indicator */}
            <mesh position={[0, 0.03, 0]} rotation={[0, 0, rotation]}>
              <boxGeometry args={[0.01, 0.02, 0.06]} />
              <meshStandardMaterial color="#d4a84a" metalness={0.9} />
            </mesh>

            {/* Symbol display */}
            {isExamining && (
              <Html position={[0, 0.1, 0]} center>
                <div
                  className="text-2xl cursor-pointer select-none"
                  style={{
                    textShadow: '0 0 10px rgba(181, 137, 74, 0.8)',
                  }}
                >
                  {dialSymbols[dialIdx][room1State.dialPositions[dialIdx]]}
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Box lid (opens when solved) */}
      <group
        position={[0, 0.3, -0.35]}
        rotation={[room1State.boxOpened ? -Math.PI / 2 : 0, 0, 0]}
      >
        <mesh castShadow>
          <boxGeometry args={[1.15, 0.1, 0.7]} />
          <meshStandardMaterial
            color="#4a3020"
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>

        {/* Decorative brass on lid */}
        <mesh position={[0, 0.051, 0]}>
          <boxGeometry args={[0.8, 0.01, 0.4]} />
          <meshStandardMaterial
            color="#b5894a"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* Key inside (visible when opened) */}
      {room1State.boxOpened && !room1State.keyObtained && (
        <group position={[0, 0.2, 0]} onClick={(e) => { e.stopPropagation(); handleTakeKey(); }}>
          {/* Invisible Hitbox for easier clicking */}
          <mesh visible={false}>
            <boxGeometry args={[0.4, 0.2, 0.3]} />
          </mesh>

          <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
            <boxGeometry args={[0.15, 0.02, 0.05]} />
            <meshStandardMaterial
              color="#d4a84a"
              roughness={0.3}
              metalness={0.9}
              emissive="#b5894a"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.03, 0.01, 8, 16]} />
            <meshStandardMaterial
              color="#d4a84a"
              roughness={0.3}
              metalness={0.9}
              emissive="#b5894a"
              emissiveIntensity={0.5}
            />
          </mesh>

          <Html position={[0, 0.1, 0]} center>
            <div 
              className="text-brass-gold text-xs font-display animate-pulse whitespace-nowrap cursor-pointer p-2"
              onClick={(e) => { e.stopPropagation(); handleTakeKey(); }}
            >
              Click to take key
            </div>
          </Html>
        </group>
      )}

      {/* Examine mode hint */}
      {!examineMode && (
        <Html position={[0, 0.6, 0]} center>
          <div className="text-brass-gold/70 text-xs font-display whitespace-nowrap">
            Click to examine
          </div>
        </Html>
      )}
    </group>
  );
}

// Bookshelf with interactive manifesto
function Bookshelf() {
  const { room1State, findManifesto, enterExamineMode, examineMode } = useGameState();
  const [hovered, setHovered] = useState(false);

  const handleManifestoClick = () => {
    if (!room1State.manifestoFound) {
      findManifesto();
    }
  };

  return (
    <group position={[-3, 1.5, -2]}>
      {/* Shelf structure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 3, 0.4]} />
        <meshStandardMaterial color="#2a1810" roughness={0.8} />
      </mesh>

      {/* Shelf dividers */}
      {[-0.8, 0, 0.8].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0.05]} castShadow>
          <boxGeometry args={[1.9, 0.05, 0.35]} />
          <meshStandardMaterial color="#3a2818" roughness={0.8} />
        </mesh>
      ))}

      {/* Regular books */}
      {[...Array(8)].map((_, idx) => (
        <mesh
          key={idx}
          position={[
            -0.6 + (idx % 4) * 0.35,
            -0.4 + Math.floor(idx / 4) * 0.8,
            0.1,
          ]}
          castShadow
        >
          <boxGeometry args={[0.08, 0.25, 0.2]} />
          <meshStandardMaterial
            color={['#4a2820', '#2a4020', '#20304a', '#4a3a20'][idx % 4]}
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Special manifesto book */}
      <group
        position={[0.5, 0.4, 0.15]}
        onClick={handleManifestoClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.3, 0.22]} />
          <meshStandardMaterial
            color={room1State.manifestoFound ? '#8b2020' : '#6b1010'}
            roughness={0.7}
            emissive={hovered && !room1State.manifestoFound ? '#ff4444' : '#000000'}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Gold text on spine */}
        <mesh position={[0.051, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.18, 0.04]} />
          <meshStandardMaterial
            color="#d4a84a"
            emissive="#b5894a"
            emissiveIntensity={room1State.manifestoFound ? 0.5 : 0.2}
          />
        </mesh>

        {hovered && !room1State.manifestoFound && (
          <Html position={[0.2, 0, 0]} center>
            <div className="text-brass-gold text-xs font-display whitespace-nowrap bg-black/80 px-2 py-1 rounded">
              The Manifesto
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

// Victorian desk
function Desk() {
  return (
    <group position={[0, 0, -1]}>
      {/* Desk top */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.1, 1.2]} />
        <meshStandardMaterial color="#3a2818" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Desk legs */}
      {[
        [-1.1, 0.35, -0.5],
        [1.1, 0.35, -0.5],
        [-1.1, 0.35, 0.5],
        [1.1, 0.35, 0.5],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.1, 0.7, 0.1]} />
          <meshStandardMaterial color="#2a1810" roughness={0.8} />
        </mesh>
      ))}

      {/* Desk drawers */}
      {[-0.6, 0.6].map((x, idx) => (
        <mesh key={idx} position={[x, 0.5, 0.55]} castShadow>
          <boxGeometry args={[0.5, 0.3, 0.05]} />
          <meshStandardMaterial color="#3a2818" roughness={0.7} />
        </mesh>
      ))}

      {/* Drawer handles */}
      {[-0.6, 0.6].map((x, idx) => (
        <mesh key={idx} position={[x, 0.5, 0.58]}>
          <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#b5894a" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// Candle with flame effect
function Candle({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
      flameRef.current.position.y = 0.15 + Math.sin(state.clock.elapsedTime * 8) * 0.005;
    }
  });

  return (
    <group position={position}>
      {/* Candle holder */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 0.05, 16]} />
        <meshStandardMaterial color="#b5894a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Candle body */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.15, 16]} />
        <meshStandardMaterial color="#f5e6d3" roughness={0.9} />
      </mesh>

      {/* Flame */}
      <mesh ref={flameRef} position={[0, 0.15, 0]}>
        <coneGeometry args={[0.015, 0.05, 8]} />
        <meshBasicMaterial color="#ffaa44" />
      </mesh>

      {/* Flame glow */}
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Window with moonlight
function Window() {
  return (
    <group position={[3, 2, -2.5]} rotation={[0, -Math.PI / 4, 0]}>
      {/* Window frame */}
      <mesh castShadow>
        <boxGeometry args={[0.1, 2, 1.5]} />
        <meshStandardMaterial color="#2a1810" roughness={0.8} />
      </mesh>

      {/* Window panes */}
      <mesh position={[0.02, 0, 0]}>
        <planeGeometry args={[1.4, 1.8]} />
        <meshStandardMaterial
          color="#1a3a5c"
          transparent
          opacity={0.3}
          emissive="#4477aa"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Moonlight beam */}
      <spotLight
        position={[2, 2, 2]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.5}
        color="#6699cc"
        castShadow
      />
    </group>
  );
}

// Back wall
function Walls() {
  return (
    <>
      {/* Back wall */}
      <mesh position={[0, 2, -3]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#1a1208" roughness={0.95} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#1a1208" roughness={0.95} />
      </mesh>

      <mesh position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#1a1208" roughness={0.95} />
      </mesh>

      {/* Wainscoting */}
      <mesh position={[0, 0.5, -2.95]}>
        <boxGeometry args={[11, 1.2, 0.05]} />
        <meshStandardMaterial color="#2a1810" roughness={0.8} />
      </mesh>
    </>
  );
}

// Main Room 1 component
export function Room1() {
  const { examineMode, exitExamineMode } = useGameState();

  return (
    <group>
      <Walls />
      <Desk />
      <PuzzleBox />
      <Bookshelf />
      <Window />

      {/* Candles on desk */}
      <Candle position={[-0.8, 0.85, -0.8]} />
      <Candle position={[0.8, 0.85, -0.8]} />

      {/* Exit examine mode hint */}
      {examineMode && (
        <Html fullscreen>
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2">
            <button
              onClick={exitExamineMode}
              className="px-4 py-2 bg-black/80 border border-brass-gold text-brass-gold font-display text-sm rounded hover:bg-brass-gold/20 transition-colors"
            >
              Press ESC or click here to exit
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
