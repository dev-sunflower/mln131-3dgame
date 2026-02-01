'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameState } from '../../../hooks/useGameState';
import { coreConfigs, coreRegistry } from './cores';
import { CoreStatus } from './cores/types';

interface WorkbenchProps {
  onSlotClick: (coreId: string) => void;
}

export function Workbench({ onSlotClick }: WorkbenchProps) {
  const {
    room3State,
    obtainBadge,
    examineMode,
    enterExamineMode,
  } = useGameState();

  const deviceRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Rotate device when powered
  useFrame(() => {
    if (deviceRef.current && room3State.devicePowered) {
      deviceRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={[0, 0.8, -0.5]}>
      {/* Workbench table */}
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.15, 1.2]} />
        <meshStandardMaterial color="#3a2818" roughness={0.7} />
      </mesh>

      {/* Table legs */}
      {[
        [-0.9, -0.5, -0.5],
        [0.9, -0.5, -0.5],
        [-0.9, -0.5, 0.5],
        [0.9, -0.5, 0.5],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.1, 0.7, 0.1]} />
          <meshStandardMaterial color="#2a1810" roughness={0.8} />
        </mesh>
      ))}

      {/* Central device base */}
      <group
        ref={deviceRef}
        position={[0, 0.1, 0]}
        onClick={() => !examineMode && enterExamineMode('device')}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Base platform */}
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.6, 0.1, 6]} />
          <meshStandardMaterial
            color="#2a2a2a"
            roughness={0.5}
            metalness={0.7}
          />
        </mesh>

        {/* Central pillar with circuits */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.2, 0.2, 8]} />
          <meshStandardMaterial
            color="#1a1a2a"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>

        {/* Component slots */}
        {coreRegistry.map((entry) => {
          const { config } = entry;
          const coreState = room3State.cores[config.id];
          const status: CoreStatus = coreState?.status || 'locked';
          const isAssembled = status === 'assembled';
          const canPlace = status === 'unlocked';

          return (
            <group key={config.id} position={config.slotPosition}>
              {/* Slot base */}
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  if (canPlace) {
                    onSlotClick(config.id);
                  }
                }}
              >
                <cylinderGeometry args={[0.1, 0.1, 0.05, 6]} />
                <meshStandardMaterial
                  color={isAssembled ? config.color : canPlace ? '#3a3a4a' : '#2a2a2a'}
                  emissive={isAssembled ? config.emissive : canPlace ? '#333344' : '#000000'}
                  emissiveIntensity={isAssembled ? 0.8 : canPlace ? 0.3 : 0}
                  roughness={0.4}
                  metalness={0.6}
                />
              </mesh>

              {/* Assembled core visualization */}
              {isAssembled && (
                <mesh position={[0, 0.08, 0]}>
                  <octahedronGeometry args={[0.08]} />
                  <meshStandardMaterial
                    color={config.color}
                    emissive={config.emissive}
                    emissiveIntensity={room3State.devicePowered ? 1 : 0.5}
                    transparent
                    opacity={0.9}
                  />
                </mesh>
              )}

              {/* Slot label */}
              <Html position={[0, -0.1, 0]} center>
                <div
                  className="text-[8px] font-display uppercase whitespace-nowrap"
                  style={{ color: isAssembled ? config.color : '#666' }}
                >
                  {config.id}
                </div>
              </Html>
            </group>
          );
        })}

        {/* Power indicator */}
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={room3State.devicePowered ? '#00ff88' : '#333333'}
            emissive={room3State.devicePowered ? '#00ff88' : '#000000'}
            emissiveIntensity={room3State.devicePowered ? 1 : 0}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* FPT Badge (appears when device is powered) */}
      {room3State.devicePowered && !room3State.badgeObtained && (
        <group position={[0, 0.6, 0.3]} onClick={obtainBadge}>
          <mesh>
            <boxGeometry args={[0.3, 0.2, 0.02]} />
            <meshStandardMaterial
              color="#ff6b00"
              emissive="#ff4400"
              emissiveIntensity={0.8}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
          <Html position={[0, 0.15, 0]} center>
            <div className="text-orange-400 text-xs font-display animate-pulse whitespace-nowrap">
              FPT Student ID - Click to claim!
            </div>
          </Html>
        </group>
      )}

      {hovered && !examineMode && (
        <Html position={[0, 0.8, 0]} center>
          <div className="text-brass-gold text-xs font-display whitespace-nowrap">
            Click to examine device
          </div>
        </Html>
      )}
    </group>
  );
}
