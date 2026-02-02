'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CoreComponentProps } from './types';

export function BaseCoreVisual({ config, status, onGameComplete, onHoverChange }: CoreComponentProps) {
  const coreRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const isLocked = status === 'locked';
  const isAssembled = status === 'assembled';

  useFrame((state) => {
    if (coreRef.current && !isAssembled) {
      coreRef.current.rotation.y += 0.01;
      
      // Floating animation
      const time = state.clock.getElapsedTime();
      coreRef.current.position.y = config.position[1] + Math.sin(time * 2) * 0.05;
    }
  });

  const handlePointerOver = () => {
    if (!isAssembled) {
      setHovered(true);
      onHoverChange(true, config.labelVi, config.position);
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHoverChange(false);
  };

  const handleClick = () => {
    if (isLocked) {
      onGameComplete();
    }
  };

  if (isAssembled) return null;

  return (
    <group
      ref={coreRef}
      position={config.position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.25, 0.02, 16, 32]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={hovered ? 1.0 : 0.6}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Core sphere */}
      <mesh castShadow>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={isLocked ? 0.7 : 1.0}
        />
      </mesh>

      {/* Inner core detail */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={isLocked ? '#ffffff' : config.color}
          emissive={isLocked ? '#ffffff' : config.color}
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* Rotating outer rings */}
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2;
        return (
          <mesh key={i} rotation={[angle, angle, 0]}>
            <torusGeometry args={[0.22, 0.01, 8, 32]} />
            <meshStandardMaterial
              color={config.color}
              emissive={config.color}
              emissiveIntensity={0.5}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}

      {/* Lock indicator for locked cores */}
      {isLocked && (
        <mesh position={[0, 0, 0.2]}>
          <boxGeometry args={[0.08, 0.12, 0.04]} />
          <meshStandardMaterial
            color="#cccccc"
            emissive="#ffffff"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Point light for glow effect */}
      <pointLight
        position={[0, 0, 0]}
        intensity={hovered ? 1.5 : 0.8}
        distance={2}
        color={config.color}
      />
    </group>
  );
}
