'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CoreConfig, CoreStatus, CoreShape } from './types';

interface BaseCoreVisualProps {
  config: CoreConfig;
  status: CoreStatus;
  onClick: () => void;
  onHoverChange?: (hovered: boolean, label: string, position: { x: number; y: number }) => void;
}

// Different geometry components based on shape
function CoreGeometry({ shape, size = 0.15 }: { shape: CoreShape; size?: number }) {
  switch (shape) {
    case 'hexagon':
      // Hexagonal prism
      return <cylinderGeometry args={[size, size, size * 1.5, 6]} />;
    case 'cylinder':
      // Smooth cylinder with more segments
      return <cylinderGeometry args={[size * 0.8, size * 0.8, size * 2, 16]} />;
    case 'crystal':
      // Tetrahedron for floating shard look
      return <tetrahedronGeometry args={[size * 1.2]} />;
    case 'octahedron':
    default:
      // Classic diamond shape
      return <octahedronGeometry args={[size]} />;
  }
}

// Small geometry for assembled state in workbench
function AssembledCoreGeometry({ shape, size = 0.1 }: { shape: CoreShape; size?: number }) {
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

export function BaseCoreVisual({ config, status, onClick, onHoverChange }: BaseCoreVisualProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { camera, size } = useThree();
  const shape = config.shape || 'octahedron';

  // Animate the core (rotate and bob)
  useFrame((state) => {
    if (groupRef.current && status !== 'assembled') {
      // Different rotation speeds based on shape
      const rotSpeed = shape === 'crystal' ? 0.015 : 0.01;
      groupRef.current.rotation.y += rotSpeed;

      // Crystal also rotates on X axis slightly
      if (shape === 'crystal') {
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      }

      // Bobbing animation
      const bobSpeed = shape === 'cylinder' ? 1.5 : 2;
      const bobAmount = shape === 'crystal' ? 0.08 : 0.05;
      groupRef.current.position.y = config.position[1] + Math.sin(state.clock.elapsedTime * bobSpeed) * bobAmount;
    }
  });

  // Project 3D position to screen for tooltip
  useEffect(() => {
    if (!onHoverChange || !groupRef.current) return;

    if (hovered) {
      const pos = new THREE.Vector3(...config.position);
      pos.y += 0.4;
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
  const opacity = isLocked ? 0.6 : 0.85;
  // Reduced emissive intensity for subtler glow
  const emissiveIntensity = hovered ? 0.6 : isLocked ? 0.15 : 0.3;

  return (
    <group
      ref={groupRef}
      position={config.position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Core shape based on config */}
      <mesh castShadow>
        <CoreGeometry shape={shape} size={0.15} />
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

      {/* Subtle glow sphere - reduced intensity */}
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={hovered ? 0.15 : 0.06}
        />
      </mesh>

      {/* Inner glow ring for hexagon */}
      {shape === 'hexagon' && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.02, 8, 6]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={hovered ? 0.4 : 0.2}
          />
        </mesh>
      )}

      {/* Vertical energy lines for cylinder */}
      {shape === 'cylinder' && (
        <>
          {[0, 90, 180, 270].map((angle, idx) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <mesh
                key={idx}
                position={[Math.cos(rad) * 0.1, 0, Math.sin(rad) * 0.1]}
              >
                <boxGeometry args={[0.01, 0.25, 0.01]} />
                <meshBasicMaterial
                  color={config.color}
                  transparent
                  opacity={hovered ? 0.5 : 0.25}
                />
              </mesh>
            );
          })}
        </>
      )}

      {/* Orbiting particle for crystal */}
      {shape === 'crystal' && (
        <group>
          {[0, 120, 240].map((angle, idx) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <mesh
                key={idx}
                position={[Math.cos(rad) * 0.2, 0, Math.sin(rad) * 0.2]}
              >
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial
                  color={config.color}
                  transparent
                  opacity={hovered ? 0.6 : 0.3}
                />
              </mesh>
            );
          })}
        </group>
      )}

      {/* Lock indicator for locked cores - subtle */}
      {isLocked && (
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#aa3333" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Subtle point light from core - very dim */}
      <pointLight
        color={config.color}
        intensity={hovered ? 0.3 : 0.1}
        distance={2}
        decay={2}
      />
    </group>
  );
}

// Export the geometry components for use in Workbench
export { CoreGeometry, AssembledCoreGeometry };
