'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useGameState } from '../hooks/useGameState';
import { Room1 } from './rooms/Room1';
import { Room2 } from './rooms/Room2';
import { Room3 } from './rooms/Room3';

// Flickering candle light component
function CandleLight({ position, intensity = 1 }: { position: [number, number, number]; intensity?: number }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      // Flicker effect
      const flicker = Math.sin(state.clock.elapsedTime * 10) * 0.1 +
        Math.sin(state.clock.elapsedTime * 15) * 0.05 +
        Math.random() * 0.05;
      lightRef.current.intensity = intensity * (0.8 + flicker);
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={position}
      color="#ffaa44"
      intensity={intensity}
      distance={8}
      decay={2}
      castShadow
      shadow-mapSize={[512, 512]}
    />
  );
}

// Ambient dust particles
function DustParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = Math.random() * 4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001;
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
        size={0.02}
        color="#8b7355"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// Camera controller that switches between room and examine mode
function CameraController() {
  const { examineMode, examinedObject, currentRoom } = useGameState();
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  // Room camera positions
  const roomPositions: { [key: number]: [number, number, number] } = {
    0: [0, 1.6, 4],
    1: [0, 1.6, 5],
    2: [0, 1.6, 4.5],
  };

  useEffect(() => {
    if (!examineMode && controlsRef.current) {
      // Reset to room view
      const targetPos = roomPositions[currentRoom] || [0, 1.6, 4];
      camera.position.set(...targetPos);
      controlsRef.current.target.set(0, 1, 0);
    }
  }, [examineMode, currentRoom, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={examineMode}
      enableZoom={examineMode}
      enableRotate={true}
      minDistance={examineMode ? 1 : 3}
      maxDistance={examineMode ? 4 : 6}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 1.5}
      minAzimuthAngle={examineMode ? -Infinity : -Math.PI / 4}
      maxAzimuthAngle={examineMode ? Infinity : Math.PI / 4}
      dampingFactor={0.05}
      rotateSpeed={0.5}
    />
  );
}

// Main scene component
export function Scene() {
  const { currentRoom, isTransitioning } = useGameState();

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault fov={60} position={[0, 1.6, 4]} />
      <CameraController />

      {/* Ambient lighting - increased brightness */}
      <ambientLight intensity={0.4} color="#2a4a7c" />

      {/* Main directional light - moonlight through window */}
      <directionalLight
        position={[5, 8, -3]}
        intensity={1.0}
        color="#88bbff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Candle lights for atmosphere */}
      <CandleLight position={[-2, 1.5, 0]} intensity={2.0} />
      <CandleLight position={[2, 1.5, -1]} intensity={1.8} />
      <CandleLight position={[0, 2, -2]} intensity={1.5} />

      {/* Dust particles */}
      <DustParticles />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#2a1e12"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Room content based on current room */}
      {currentRoom === 0 && <Room1 />}
      {currentRoom === 1 && <Room2 />}
      {currentRoom === 2 && <Room3 />}

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
        <Vignette
          offset={0.3}
          darkness={0.4}
          blendFunction={BlendFunction.NORMAL}
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.001, 0.001)}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}
