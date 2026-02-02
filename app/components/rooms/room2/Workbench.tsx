'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameState } from '../../../hooks/useGameState';
import { coreRegistry } from './cores';

export function Workbench({ onSlotClick }: { onSlotClick: (coreId: string) => void }) {
  const { room2State } = useGameState();
  const benchRef = useRef<THREE.Group>(null);

  // Check if all cores are assembled
  const allAssembled = Object.values(room2State.cores).every(
    (core) => core.status === 'assembled'
  );

  useFrame(() => {
    if (benchRef.current && allAssembled) {
      benchRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={benchRef} position={[0, 0.5, -0.5]}>
      {/* Base platform */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.15, 32]} />
        <meshStandardMaterial color="#2a1810" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Central pedestal */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.4, 16]} />
        <meshStandardMaterial color="#8b0000" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Red star on top */}
      <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 5]} />
        <meshStandardMaterial
          color="#cc0000"
          emissive="#cc0000"
          emissiveIntensity={allAssembled ? 1.0 : 0.3}
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>

      {/* Four core slots around the center */}
      {coreRegistry.map((entry) => {
        const { id, config } = entry;
        const coreState = room2State.cores[id];
        const status = coreState?.status || 'locked';
        const isAssembled = status === 'assembled';
        const canPlace = status === 'unlocked';

        return (
          <group key={id} position={config.slotPosition}>
            {/* Slot indicator */}
            <mesh
              position={[0, 0, 0]}
              onClick={(e) => {
                e.stopPropagation();
                if (canPlace) onSlotClick(id);
              }}
              castShadow
            >
              <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
              <meshStandardMaterial
                color={isAssembled ? config.color : canPlace ? '#4a4a4a' : '#2a2a2a'}
                emissive={isAssembled ? config.color : '#000000'}
                emissiveIntensity={isAssembled ? 0.5 : 0}
                roughness={0.6}
                metalness={0.5}
              />
            </mesh>

            {/* Small placed core visual */}
            {isAssembled && (
              <>
                <mesh position={[0, 0.1, 0]}>
                  <sphereGeometry args={[0.08, 16, 16]} />
                  <meshStandardMaterial
                    color={config.color}
                    emissive={config.color}
                    emissiveIntensity={0.8}
                    roughness={0.3}
                    metalness={0.7}
                  />
                </mesh>
                <pointLight
                  position={[0, 0.1, 0]}
                  intensity={0.5}
                  distance={1}
                  color={config.color}
                />
              </>
            )}

            {/* Slot label */}
            <Html position={[0, -0.1, 0]} center>
              <div className="text-[8px] font-display text-white/50 whitespace-nowrap uppercase">
                {config.labelVi.split(' ')[0]}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Connecting beams between slots */}
      {allAssembled && (
        <>
          {/* Diagonal beams */}
          <mesh position={[0, 0.25, 0]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[1.7, 0.02, 0.02]} />
            <meshStandardMaterial
              color="#ffcc00"
              emissive="#ffcc00"
              emissiveIntensity={0.8}
            />
          </mesh>
          <mesh position={[0, 0.25, 0]} rotation={[0, -Math.PI / 4, 0]}>
            <boxGeometry args={[1.7, 0.02, 0.02]} />
            <meshStandardMaterial
              color="#ffcc00"
              emissive="#ffcc00"
              emissiveIntensity={0.8}
            />
          </mesh>

          {/* Energy effect in center */}
          <pointLight position={[0, 0.3, 0]} intensity={2} distance={3} color="#ffcc00" />
        </>
      )}

      {/* Decorative base rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, -0.15 + i * 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9 - i * 0.15, 0.02, 8, 32]} />
          <meshStandardMaterial color="#4a2020" roughness={0.6} metalness={0.5} />
        </mesh>
      ))}

      {/* Success message */}
      {allAssembled && (
        <Html position={[0, 1.2, 0]} center>
          <div className="text-red-500 font-display text-sm bg-black/90 px-4 py-2 rounded border border-red-500 whitespace-nowrap">
            ⭐ Hoàn thành! Dialectical Synthesis Complete!
          </div>
        </Html>
      )}
    </group>
  );
}
