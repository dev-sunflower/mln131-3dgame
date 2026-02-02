'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameState } from '../../../hooks/useGameState';
import { coreConfigs, coreRegistry } from './cores';
import { CoreStatus, CoreShape } from './cores/types';
import { useRoom3UI } from './useRoom3UI';

interface WorkbenchProps {
  onSlotClick: (coreId: string) => void;
}

// Assembled core geometry based on shape
function AssembledCoreGeometry({ shape, size = 0.1 }: { shape?: CoreShape; size?: number }) {
  switch (shape) {
    case 'hexagon':
      return <cylinderGeometry args={[size, size, size * 1.2, 6]} />;
    case 'cylinder':
      return <cylinderGeometry args={[size * 0.7, size * 0.7, size * 1.5, 16]} />;
    case 'crystal':
      return <tetrahedronGeometry args={[size]} />;
    case 'octahedron':
    default:
      return <octahedronGeometry args={[size * 0.8]} />;
  }
}

export function Workbench({ onSlotClick }: WorkbenchProps) {
  const { room3State, obtainBadge } = useGameState();

  // Get game started state from Room3 UI store
  const gameStarted = useRoom3UI((s) => s.gameStarted);
  const startGame = useRoom3UI((s) => s.startGame);

  const deviceRef = useRef<THREE.Group>(null);
  const energyRingRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Rotate device and energy effects when powered
  useFrame((state) => {
    if (deviceRef.current && room3State.devicePowered) {
      deviceRef.current.rotation.y += 0.005;
    }
    if (energyRingRef.current && room3State.devicePowered) {
      energyRingRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group position={[0, 0, -1]}>
      {/* Central assembly device - sits on top of the machine base */}
      <group
        ref={deviceRef}
        position={[0, 0.5, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Main assembly ring */}
        <mesh castShadow receiveShadow>
          <torusGeometry args={[0.6, 0.08, 16, 32]} />
          <meshStandardMaterial
            color={room3State.devicePowered ? '#2a3a4a' : '#1a1a25'}
            emissive={room3State.devicePowered ? '#223344' : '#0a0a10'}
            emissiveIntensity={room3State.devicePowered ? 0.3 : 0.05}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* Inner assembly ring */}
        <mesh position={[0, 0.05, 0]}>
          <torusGeometry args={[0.35, 0.04, 12, 24]} />
          <meshStandardMaterial
            color="#252535"
            emissive={room3State.devicePowered ? '#334455' : '#111115'}
            emissiveIntensity={room3State.devicePowered ? 0.4 : 0.1}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* Energy ring - visible when powered */}
        {room3State.devicePowered && (
          <mesh ref={energyRingRef} position={[0, 0.1, 0]}>
            <torusGeometry args={[0.5, 0.01, 8, 32]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.6} />
          </mesh>
        )}

        {/* Core slots - 3 positions around the ring */}
        {coreRegistry.map((entry, idx) => {
          const { config } = entry;
          const coreState = room3State.cores[config.id];
          const status: CoreStatus = coreState?.status || 'locked';
          const isAssembled = status === 'assembled';
          const canPlace = status === 'unlocked';

          // Position slots around the ring
          const angle = (idx * 120 - 90) * (Math.PI / 180); // -90 to start from top
          const slotX = Math.cos(angle) * 0.5;
          const slotZ = Math.sin(angle) * 0.5;

          return (
            <group key={config.id} position={[slotX, 0, slotZ]}>
              {/* Slot socket */}
              <mesh
                rotation={[0, -angle + Math.PI / 2, 0]}
                onClick={(e) => {
                  e.stopPropagation();
                  if (canPlace) {
                    onSlotClick(config.id);
                  }
                }}
              >
                <cylinderGeometry args={[0.12, 0.12, 0.06, config.shape === 'hexagon' ? 6 : config.shape === 'cylinder' ? 16 : 8]} />
                <meshStandardMaterial
                  color={isAssembled ? config.color : canPlace ? '#3a3a4a' : '#1a1a20'}
                  emissive={isAssembled ? config.emissive : canPlace ? '#222230' : '#000000'}
                  emissiveIntensity={isAssembled ? 0.5 : canPlace ? 0.2 : 0}
                  roughness={0.3}
                  metalness={0.7}
                />
              </mesh>

              {/* Connection line to center */}
              <mesh position={[-slotX * 0.3, 0.03, -slotZ * 0.3]} rotation={[0, -angle, 0]}>
                <boxGeometry args={[0.02, 0.02, 0.2]} />
                <meshStandardMaterial
                  color={isAssembled ? config.color : '#2a2a30'}
                  emissive={isAssembled ? config.emissive : '#000000'}
                  emissiveIntensity={isAssembled ? 0.4 : 0}
                  roughness={0.4}
                  metalness={0.6}
                />
              </mesh>

              {/* Assembled core visualization */}
              {isAssembled && (
                <group position={[0, 0.12, 0]}>
                  <mesh>
                    <AssembledCoreGeometry shape={config.shape} size={0.08} />
                    <meshStandardMaterial
                      color={config.color}
                      emissive={config.emissive}
                      emissiveIntensity={room3State.devicePowered ? 0.7 : 0.4}
                      transparent
                      opacity={0.9}
                      roughness={0.2}
                      metalness={0.8}
                    />
                  </mesh>
                  {/* Subtle glow */}
                  <mesh>
                    <sphereGeometry args={[0.1, 12, 12]} />
                    <meshBasicMaterial
                      color={config.color}
                      transparent
                      opacity={0.1}
                    />
                  </mesh>
                </group>
              )}

              {/* Slot label */}
              <Html position={[0, -0.12, 0]} center>
                <div
                  className="text-[7px] font-mono uppercase whitespace-nowrap tracking-wider"
                  style={{
                    color: isAssembled ? config.color : canPlace ? '#666' : '#333',
                    textShadow: isAssembled ? `0 0 4px ${config.color}` : 'none'
                  }}
                >
                  {config.id}
                </div>
              </Html>
            </group>
          );
        })}

        {/* Central power core indicator */}
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color={room3State.devicePowered ? '#00ff88' : '#1a1a20'}
            emissive={room3State.devicePowered ? '#00ff88' : '#0a0a10'}
            emissiveIntensity={room3State.devicePowered ? 0.8 : 0.05}
            roughness={0.2}
          />
        </mesh>

        {/* Power beam when active */}
        {room3State.devicePowered && (
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.02, 0.05, 1.2, 8]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
          </mesh>
        )}
      </group>


      {/* FPT Badge (appears when device is powered) - LARGE and visible */}
      {room3State.devicePowered && !room3State.badgeObtained && (
        <Html position={[0, 2.5, 1]} center>
          <div
            onClick={obtainBadge}
            className="cursor-pointer animate-bounce"
          >
            {/* FPT Student Card */}
            <div
              className="relative p-6 rounded-2xl border-4 border-orange-400
                         bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500
                         shadow-[0_0_60px_#ff6b00,0_0_100px_#ff6b0066]
                         transform hover:scale-110 transition-all duration-300"
              style={{ minWidth: '320px' }}
            >
              {/* FPT Logo area */}
              <div className="text-center mb-4">
                <div className="text-4xl font-black text-white tracking-wider drop-shadow-lg">
                  FPT UNIVERSITY
                </div>
                <div className="text-sm text-orange-100 font-semibold tracking-widest mt-1">
                  STUDENT ID CARD
                </div>
              </div>

              {/* Divider */}
              <div className="h-1 bg-white/30 rounded-full mb-4" />

              {/* Student info */}
              <div className="text-white text-center space-y-2">
                <div className="text-2xl font-bold">🎓 CHÚC MỪNG!</div>
                <div className="text-lg">Bạn đã hoàn thành Room 3</div>
              </div>

              {/* Click instruction */}
              <div className="mt-6 text-center">
                <div className="inline-block px-6 py-3 bg-white/20 rounded-xl
                              border-2 border-white/50 text-white font-bold text-lg
                              hover:bg-white/30 transition-all animate-pulse">
                  👆 CLICK ĐỂ NHẬN THẺ!
                </div>
              </div>

              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/50" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white/50" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white/50" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/50" />
            </div>
          </div>
        </Html>
      )}

      {/* Start Game button - styled to match room UI */}
      {!gameStarted && (
        <Html position={[0, 1.2, 0.5]} center>
          <button
            onClick={(e) => {
              e.stopPropagation();
              startGame();
            }}
            className="
              px-8 py-4 rounded-lg font-display text-base tracking-wider
              transition-all duration-300 transform
              bg-slate-800/90 hover:bg-slate-700/90
              text-teal-300 hover:text-teal-200
              border border-teal-500/50 hover:border-teal-400
              hover:scale-105
              shadow-[0_0_15px_rgba(20,184,166,0.2)]
              hover:shadow-[0_0_25px_rgba(20,184,166,0.3)]
              cursor-pointer
            "
            style={{ minWidth: '200px' }}
          >
            ▶ BẮT ĐẦU CHƠI
          </button>
        </Html>
      )}
    </group>
  );
}
