'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../../../hooks/useGameState';

// Rotating mechanical gear component
function Gear({
  position,
  radius = 0.5,
  teeth = 12,
  thickness = 0.1,
  speed = 0.01,
  color = '#1a1a2a',
  reverse = false,
  powered = false
}: {
  position: [number, number, number];
  radius?: number;
  teeth?: number;
  thickness?: number;
  speed?: number;
  color?: string;
  reverse?: boolean;
  powered?: boolean;
}) {
  const gearRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (gearRef.current) {
      // Faster rotation when powered
      const actualSpeed = powered ? speed * 3 : speed;
      gearRef.current.rotation.z += reverse ? -actualSpeed : actualSpeed;
    }
  });

  return (
    <group ref={gearRef} position={position}>
      {/* Gear body */}
      <mesh>
        <cylinderGeometry args={[radius, radius, thickness, 32]} />
        <meshStandardMaterial
          color={powered ? '#2a3a4a' : color}
          emissive={powered ? '#1a2a3a' : '#000000'}
          emissiveIntensity={powered ? 0.2 : 0}
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>
      {/* Center hole */}
      <mesh position={[0, thickness / 2 + 0.001, 0]}>
        <cylinderGeometry args={[radius * 0.2, radius * 0.2, 0.01, 16]} />
        <meshStandardMaterial color="#0a0a0f" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Gear teeth */}
      {Array.from({ length: teeth }).map((_, i) => {
        const angle = (i / teeth) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[radius * 0.15, thickness, radius * 0.2]} />
            <meshStandardMaterial
              color={powered ? '#2a3a4a' : color}
              emissive={powered ? '#1a2a3a' : '#000000'}
              emissiveIntensity={powered ? 0.2 : 0}
              roughness={0.4}
              metalness={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Pipe segment
function Pipe({
  start,
  end,
  radius = 0.08,
  color = '#2a2a3a',
  powered = false
}: {
  start: [number, number, number];
  end: [number, number, number];
  radius?: number;
  color?: string;
  powered?: boolean;
}) {
  const direction = new THREE.Vector3(
    end[0] - start[0],
    end[1] - start[1],
    end[2] - start[2]
  );
  const length = direction.length();
  const midPoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2
  ];

  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize()
  );
  const euler = new THREE.Euler().setFromQuaternion(quaternion);

  return (
    <mesh position={midPoint} rotation={[euler.x, euler.y, euler.z]}>
      <cylinderGeometry args={[radius, radius, length, 8]} />
      <meshStandardMaterial
        color={powered ? '#3a4a5a' : color}
        emissive={powered ? '#2a3a4a' : '#000000'}
        emissiveIntensity={powered ? 0.15 : 0}
        roughness={0.5}
        metalness={0.7}
      />
    </mesh>
  );
}

// Central machine - now with powered state
function CentralMachine({ powered }: { powered: boolean }) {
  return (
    <group position={[0, 0, -1]}>
      {/* Main machine base - large hexagonal platform */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2, 2.2, 0.2, 6]} />
        <meshStandardMaterial
          color={powered ? '#2a3a4a' : '#1a1a1f'}
          emissive={powered ? '#1a2a3a' : '#000000'}
          emissiveIntensity={powered ? 0.2 : 0}
          roughness={0.6}
          metalness={0.7}
        />
      </mesh>

      {/* Secondary raised platform */}
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.2, 6]} />
        <meshStandardMaterial
          color={powered ? '#354555' : '#252530'}
          emissive={powered ? '#253545' : '#000000'}
          emissiveIntensity={powered ? 0.25 : 0}
          roughness={0.5}
          metalness={0.6}
        />
      </mesh>

      {/* Central pillar structure */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 1.6, 8]} />
        <meshStandardMaterial
          color={powered ? '#2a3a45' : '#1a1a25'}
          emissive={powered ? '#1a2a35' : '#000000'}
          emissiveIntensity={powered ? 0.3 : 0}
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>

      {/* Top platform for power core */}
      <mesh position={[0, 2.1, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.4, 0.2, 8]} />
        <meshStandardMaterial
          color={powered ? '#3a4a55' : '#2a2a35'}
          emissive={powered ? '#2a3a45' : '#000000'}
          emissiveIntensity={powered ? 0.35 : 0}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Socket indicators around pillar */}
      {[0, 120, 240].map((angle, idx) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 0.8;
        const z = Math.sin(rad) * 0.8;
        return (
          <group key={idx} position={[x, 0.5, z]}>
            <mesh>
              <cylinderGeometry args={[0.15, 0.15, 0.1, 6]} />
              <meshStandardMaterial
                color={powered ? '#2a3a4a' : '#1a1a20'}
                emissive={powered ? '#1a2a3a' : '#111115'}
                emissiveIntensity={powered ? 0.4 : 0.1}
                roughness={0.3}
                metalness={0.8}
              />
            </mesh>
            <mesh position={[-x * 0.4, 0.3, -z * 0.4]} rotation={[0, -rad, Math.PI / 6]}>
              <boxGeometry args={[0.08, 0.6, 0.08]} />
              <meshStandardMaterial
                color={powered ? '#3a4a55' : '#2a2a35'}
                emissive={powered ? '#2a3a45' : '#000000'}
                emissiveIntensity={powered ? 0.2 : 0}
                roughness={0.5}
                metalness={0.7}
              />
            </mesh>
          </group>
        );
      })}

      {/* Decorative rings around pillar */}
      {[0.6, 1.0, 1.4, 1.8].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]}>
          <torusGeometry args={[0.4 - idx * 0.02, 0.03, 8, 32]} />
          <meshStandardMaterial
            color={powered ? '#4a5a6a' : '#3a3a45'}
            emissive={powered ? '#3a4a5a' : '#222230'}
            emissiveIntensity={powered ? 0.5 : 0.05}
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
      ))}

      {/* Status lights on base - green when powered */}
      {[0, 60, 120, 180, 240, 300].map((angle, idx) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <mesh key={idx} position={[Math.cos(rad) * 1.8, 0.22, Math.sin(rad) * 1.8]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color={powered ? '#00ff88' : '#1a1a20'}
              emissive={powered ? '#00ff88' : '#0a0a10'}
              emissiveIntensity={powered ? 0.8 : 0.2}
              roughness={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Wall machinery
function WallMachinery({ powered }: { powered: boolean }) {
  return (
    <group>
      {/* Left wall machinery panel */}
      <group position={[-6, 2, -2]}>
        <mesh>
          <boxGeometry args={[0.3, 3, 4]} />
          <meshStandardMaterial
            color={powered ? '#2a3a4a' : '#1a1a20'}
            emissive={powered ? '#1a2a3a' : '#000000'}
            emissiveIntensity={powered ? 0.15 : 0}
            roughness={0.7}
            metalness={0.5}
          />
        </mesh>
        <Gear position={[0.2, 0.5, -1]} radius={0.4} teeth={10} speed={0.005} powered={powered} />
        <Gear position={[0.2, 0.5, 0.5]} radius={0.3} teeth={8} speed={0.008} reverse powered={powered} />
        <Gear position={[0.2, -0.3, -0.3]} radius={0.5} teeth={12} speed={0.003} powered={powered} />

        <Pipe start={[0.2, 1.2, -1.5]} end={[0.2, 1.2, 1.5]} radius={0.06} powered={powered} />
        <Pipe start={[0.2, -0.8, -1.5]} end={[0.2, -0.8, 1.5]} radius={0.06} powered={powered} />
      </group>

      {/* Right wall machinery panel */}
      <group position={[6, 2, -2]}>
        <mesh>
          <boxGeometry args={[0.3, 3, 4]} />
          <meshStandardMaterial
            color={powered ? '#2a3a4a' : '#1a1a20'}
            emissive={powered ? '#1a2a3a' : '#000000'}
            emissiveIntensity={powered ? 0.15 : 0}
            roughness={0.7}
            metalness={0.5}
          />
        </mesh>
        <Gear position={[-0.2, 0.8, -0.8]} radius={0.35} teeth={9} speed={0.006} reverse powered={powered} />
        <Gear position={[-0.2, -0.2, 0.8]} radius={0.45} teeth={11} speed={0.004} powered={powered} />
        <Gear position={[-0.2, 0.2, -0.2]} radius={0.25} teeth={7} speed={0.01} powered={powered} />

        <Pipe start={[-0.2, 1.5, -1.8]} end={[-0.2, 1.5, 1.8]} radius={0.05} powered={powered} />
      </group>

      {/* Back wall industrial panel */}
      <group position={[0, 3, -5.8]}>
        <mesh receiveShadow>
          <boxGeometry args={[8, 4, 0.3]} />
          <meshStandardMaterial
            color={powered ? '#253545' : '#151520'}
            emissive={powered ? '#152535' : '#000000'}
            emissiveIntensity={powered ? 0.15 : 0}
            roughness={0.8}
            metalness={0.4}
          />
        </mesh>

        {/* Display screen - active when powered */}
        <mesh position={[0, 0.5, 0.16]}>
          <boxGeometry args={[3, 2, 0.02]} />
          <meshStandardMaterial
            color={powered ? '#1a3a4a' : '#0a0a12'}
            emissive={powered ? '#0a2a3a' : '#050510'}
            emissiveIntensity={powered ? 0.5 : 0.1}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>

        {/* Status indicator lights - green when powered */}
        {[-2.5, -1.5, 1.5, 2.5].map((x, idx) => (
          <mesh key={idx} position={[x, -1.2, 0.16]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color={powered ? '#00ff88' : '#1a1a1a'}
              emissive={powered ? '#00ff88' : '#101010'}
              emissiveIntensity={powered ? 0.8 : 0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Ceiling mechanical arms */}
      <group position={[2.5, 4.5, -2]}>
        <mesh rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.15, 2, 0.15]} />
          <meshStandardMaterial
            color={powered ? '#3a4a55' : '#2a2a35'}
            emissive={powered ? '#2a3a45' : '#000000'}
            emissiveIntensity={powered ? 0.15 : 0}
            roughness={0.5}
            metalness={0.7}
          />
        </mesh>
        <mesh position={[0.5, -0.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.12, 1.2, 0.12]} />
          <meshStandardMaterial
            color={powered ? '#354555' : '#252530'}
            emissive={powered ? '#253545' : '#000000'}
            emissiveIntensity={powered ? 0.15 : 0}
            roughness={0.5}
            metalness={0.7}
          />
        </mesh>
      </group>

      <group position={[-3, 4.5, -1]}>
        <mesh rotation={[0, 0, -Math.PI / 8]}>
          <boxGeometry args={[0.15, 1.8, 0.15]} />
          <meshStandardMaterial
            color={powered ? '#3a4a55' : '#2a2a35'}
            emissive={powered ? '#2a3a45' : '#000000'}
            emissiveIntensity={powered ? 0.15 : 0}
            roughness={0.5}
            metalness={0.7}
          />
        </mesh>
      </group>
    </group>
  );
}

// Walls
function Walls({ powered }: { powered: boolean }) {
  return (
    <>
      <mesh position={[0, 2.5, -6]} receiveShadow>
        <planeGeometry args={[16, 6]} />
        <meshStandardMaterial
          color={powered ? '#151520' : '#0a0a0f'}
          emissive={powered ? '#0a0a15' : '#000000'}
          emissiveIntensity={powered ? 0.1 : 0}
          roughness={0.95}
        />
      </mesh>

      <mesh position={[-7, 2.5, -1]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial
          color={powered ? '#151520' : '#0a0a0f'}
          emissive={powered ? '#0a0a15' : '#000000'}
          emissiveIntensity={powered ? 0.1 : 0}
          roughness={0.95}
        />
      </mesh>

      <mesh position={[7, 2.5, -1]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial
          color={powered ? '#151520' : '#0a0a0f'}
          emissive={powered ? '#0a0a15' : '#000000'}
          emissiveIntensity={powered ? 0.1 : 0}
          roughness={0.95}
        />
      </mesh>

      <mesh position={[0, 5.5, -1]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial
          color={powered ? '#101520' : '#080810'}
          emissive={powered ? '#050a15' : '#000000'}
          emissiveIntensity={powered ? 0.1 : 0}
          roughness={0.9}
        />
      </mesh>

      {[[-5, 0.01, -3], [5, 0.01, -3], [-5, 0.01, 2], [5, 0.01, 2]].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial
            color={powered ? '#2a3a4a' : '#1a1a20'}
            emissive={powered ? '#1a2a3a' : '#000000'}
            emissiveIntensity={powered ? 0.1 : 0}
            roughness={0.8}
            metalness={0.6}
          />
        </mesh>
      ))}

      <mesh position={[0, 0.02, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3, 6]} />
        <meshStandardMaterial
          color={powered ? '#253545' : '#151520'}
          emissive={powered ? '#152535' : '#000000'}
          emissiveIntensity={powered ? 0.15 : 0}
          roughness={0.6}
          metalness={0.7}
        />
      </mesh>
    </>
  );
}

// Support pillars
function Pillars({ powered }: { powered: boolean }) {
  const pillarPositions: [number, number, number][] = [
    [-5, 2.75, -4],
    [5, 2.75, -4],
    [-5, 2.75, 2],
    [5, 2.75, 2],
  ];

  return (
    <>
      {pillarPositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.4, 5.5, 0.4]} />
            <meshStandardMaterial
              color={powered ? '#2a3a45' : '#1a1a25'}
              emissive={powered ? '#1a2a35' : '#000000'}
              emissiveIntensity={powered ? 0.1 : 0}
              roughness={0.7}
              metalness={0.5}
            />
          </mesh>
          <mesh position={[0, -2.5, 0]}>
            <boxGeometry args={[0.6, 0.3, 0.6]} />
            <meshStandardMaterial
              color={powered ? '#354555' : '#252530'}
              emissive={powered ? '#253545' : '#000000'}
              emissiveIntensity={powered ? 0.1 : 0}
              roughness={0.6}
              metalness={0.6}
            />
          </mesh>
          <mesh position={[0, 2.5, 0]}>
            <boxGeometry args={[0.5, 0.2, 0.5]} />
            <meshStandardMaterial
              color={powered ? '#354555' : '#252530'}
              emissive={powered ? '#253545' : '#000000'}
              emissiveIntensity={powered ? 0.1 : 0}
              roughness={0.6}
              metalness={0.6}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Atmospheric particles
function FogParticles({ powered }: { powered: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 300;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = Math.random() * 5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 1;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const speed = powered ? 0.15 : 0.1;
      for (let i = 0; i < count; i++) {
        posArray[i * 3] += Math.sin(state.clock.elapsedTime * speed + i * 0.1) * 0.002;
        posArray[i * 3 + 1] += Math.sin(state.clock.elapsedTime * speed * 2 + i * 0.05) * 0.001;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={powered ? '#5a6a7a' : '#3a4050'}
        transparent
        opacity={powered ? 0.5 : 0.3}
        sizeAttenuation
      />
    </points>
  );
}

// Main Room 3 Environment
export function Room3Environment() {
  const { room3State } = useGameState();
  const powered = room3State.devicePowered;

  return (
    <group>
      <Walls powered={powered} />
      <Pillars powered={powered} />
      <CentralMachine powered={powered} />
      <WallMachinery powered={powered} />
      <FogParticles powered={powered} />

      {/* Base ambient lights */}
      <pointLight
        position={[0, 4, -1]}
        color={powered ? '#3a5a7a' : '#1a2030'}
        intensity={powered ? 0.5 : 0.15}
        distance={12}
      />
      <pointLight
        position={[-5, 2, 0]}
        color={powered ? '#2a4a6a' : '#151525'}
        intensity={powered ? 0.3 : 0.1}
        distance={8}
      />
      <pointLight
        position={[5, 2, 0]}
        color={powered ? '#2a4a6a' : '#151525'}
        intensity={powered ? 0.3 : 0.1}
        distance={8}
      />

      {/* Core position accent lights */}
      <pointLight
        position={[-4, 1.5, 1]}
        color="#00d4ff"
        intensity={powered ? 0.2 : 0.05}
        distance={4}
      />
      <pointLight
        position={[4, 1.5, -2]}
        color="#bd00ff"
        intensity={powered ? 0.2 : 0.05}
        distance={4}
      />
      <pointLight
        position={[0, 3.5, -4]}
        color="#ffd700"
        intensity={powered ? 0.2 : 0.05}
        distance={4}
      />

      {/* Central power light when active */}
      {powered && (
        <>
          <pointLight
            position={[0, 1.5, -1]}
            color="#00ff88"
            intensity={0.8}
            distance={6}
          />
          <spotLight
            position={[0, 5, -1]}
            target-position={[0, 0, -1]}
            angle={0.5}
            penumbra={0.5}
            color="#4488aa"
            intensity={1.5}
            distance={8}
          />
        </>
      )}

      {/* Distance fog sphere - lighter when powered */}
      <mesh position={[0, 2.5, -1]}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial
          color={powered ? '#101520' : '#050510'}
          transparent
          opacity={powered ? 0.15 : 0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
