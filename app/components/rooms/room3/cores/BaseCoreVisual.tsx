'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CoreConfig, CoreStatus } from './types';

interface BaseCoreVisualProps {
  config: CoreConfig;
  status: CoreStatus;
  onClick: () => void;
  onHoverChange?: (hovered: boolean, label: string, position: { x: number; y: number }) => void;
}

export function BaseCoreVisual({ config, status, onClick, onHoverChange }: BaseCoreVisualProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { camera, size } = useThree();

  // Animate the core (rotate and bob)
  useFrame((state) => {
    if (groupRef.current && status !== 'assembled') {
      groupRef.current.rotation.y += 0.02;
      groupRef.current.position.y = config.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  // Project 3D position to screen for tooltip
  useEffect(() => {
    if (!onHoverChange || !groupRef.current) return;

    if (hovered) {
      const pos = new THREE.Vector3(...config.position);
      pos.y += 0.3;
      pos.project(camera);
      const x = (pos.x * 0.5 + 0.5) * size.width;
      const y = (-pos.y * 0.5 + 0.5) * size.height;
      const label = `${config.label}${status === 'locked' ? ' (Locked)' : ''}`;
      onHoverChange(true, label, { x, y });
    } else {
      onHoverChange(false, '', { x: 0, y: 0 });
    }
  }, [hovered, camera, size, config, status, onHoverChange]);

  // Don't render if assembled (it's in the workbench slot)
  if (status === 'assembled') return null;

  const isLocked = status === 'locked';
  const opacity = isLocked ? 0.7 : 0.9;
  const emissiveIntensity = hovered ? 1 : isLocked ? 0.3 : 0.5;

  return (
    <group
      ref={groupRef}
      position={config.position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Crystal/chip shape - octahedron */}
      <mesh castShadow>
        <octahedronGeometry args={[0.12]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Glow sphere */}
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={hovered ? 0.3 : 0.15}
        />
      </mesh>

      {/* Lock indicator for locked cores */}
      {isLocked && (
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ff4444" />
        </mesh>
      )}
    </group>
  );
}
