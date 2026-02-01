'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameState } from '../../../hooks/useGameState';
import { coreConfigs, coreRegistry } from './cores';
import { CoreStatus, CoreShape } from './cores/types';

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
  const {
    room3State,
    obtainBadge,
    examineMode,
    enterExamineMode,
  } = useGameState();

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
        onClick={() => !examineMode && enterExamineMode('device')}
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


      {/* FPT Badge (appears when device is powered) */}
      {room3State.devicePowered && !room3State.badgeObtained && (
        <group position={[0, 1.8, 0]} onClick={obtainBadge}>
          <mesh>
            <boxGeometry args={[0.35, 0.22, 0.03]} />
            <meshStandardMaterial
              color="#ff6b00"
              emissive="#ff4400"
              emissiveIntensity={0.6}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
          {/* Badge glow ring */}
          <mesh position={[0, 0, -0.02]}>
            <torusGeometry args={[0.25, 0.02, 8, 24]} />
            <meshBasicMaterial color="#ff6b00" transparent opacity={0.4} />
          </mesh>
          <Html position={[0, 0.2, 0]} center>
            <div className="text-orange-400 text-xs font-display animate-pulse whitespace-nowrap">
              FPT Student ID - Click to claim!
            </div>
          </Html>
        </group>
      )}

      {/* Examine hint */}
      {hovered && !examineMode && (
        <Html position={[0, 0.9, 0.3]} center>
          <div className="text-slate-400 text-xs font-mono whitespace-nowrap">
            Click to examine
          </div>
        </Html>
      )}
    </group>
  );
}
