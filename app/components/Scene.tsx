'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
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
import { Room1 } from './rooms/room1';
import { Room2 } from './rooms/room2';
import { Room3 } from './rooms/room3';

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
  const { examineMode, currentRoom } = useGameState();
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  // Room camera positions and settings
  const roomSettings: {
    [key: number]: {
      position: [number, number, number];
      target: [number, number, number];
      minDistance: number;
      maxDistance: number;
      minAzimuth: number;
      maxAzimuth: number;
      minPolar: number;
      maxPolar: number;
      rotateSpeed: number;
      dampingFactor: number;
    }
  } = {
    0: {
      position: [0, 1.6, 4],
      target: [0, 1, 0],
      minDistance: 3,
      maxDistance: 6,
      minAzimuth: -Math.PI / 4,
      maxAzimuth: Math.PI / 4,
      minPolar: Math.PI / 6,
      maxPolar: Math.PI / 1.5,
      rotateSpeed: 0.5,
      dampingFactor: 0.05,
    },
    1: {
      position: [0, 1.6, 5],
      target: [0, 1, 0],
      minDistance: 3,
      maxDistance: 6,
      minAzimuth: -Math.PI / 4,
      maxAzimuth: Math.PI / 4,
      minPolar: Math.PI / 6,
      maxPolar: Math.PI / 1.5,
      rotateSpeed: 0.5,
      dampingFactor: 0.05,
    },
    2: {
      // Room 3 - Large mechanical room with wider camera movement
      position: [0, 2.5, 6],
      target: [0, 1.5, -1],
      minDistance: 4,
      maxDistance: 10,
      // Much wider horizontal rotation
      minAzimuth: -Math.PI / 2.5,
      maxAzimuth: Math.PI / 2.5,
      // Allows looking up and down more
      minPolar: Math.PI / 8,
      maxPolar: Math.PI / 1.8,
      // Slower, smoother movement
      rotateSpeed: 0.3,
      dampingFactor: 0.03,
    },
  };

  useEffect(() => {
    if (!controlsRef.current) return;

    const settings = roomSettings[currentRoom] || roomSettings[0];

    if (!examineMode) {
      // Reset to room view
      camera.position.set(...settings.position);
      controlsRef.current.target.set(...settings.target);
    }

    // Update control limits based on room
    controlsRef.current.minDistance = examineMode ? 1 : settings.minDistance;
    controlsRef.current.maxDistance = examineMode ? 5 : settings.maxDistance;
    controlsRef.current.minAzimuthAngle = examineMode ? -Infinity : settings.minAzimuth;
    controlsRef.current.maxAzimuthAngle = examineMode ? Infinity : settings.maxAzimuth;
    controlsRef.current.minPolarAngle = settings.minPolar;
    controlsRef.current.maxPolarAngle = settings.maxPolar;
    controlsRef.current.rotateSpeed = settings.rotateSpeed;
    controlsRef.current.dampingFactor = settings.dampingFactor;

  }, [examineMode, currentRoom, camera]);

  const settings = roomSettings[currentRoom] || roomSettings[0];

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={examineMode}
      enableZoom={examineMode || currentRoom === 2} // Allow zoom in Room 3
      enableRotate={true}
      minDistance={examineMode ? 1 : settings.minDistance}
      maxDistance={examineMode ? 5 : settings.maxDistance}
      minPolarAngle={settings.minPolar}
      maxPolarAngle={settings.maxPolar}
      minAzimuthAngle={examineMode ? -Infinity : settings.minAzimuth}
      maxAzimuthAngle={examineMode ? Infinity : settings.maxAzimuth}
      dampingFactor={settings.dampingFactor}
      rotateSpeed={settings.rotateSpeed}
      enableDamping={true}
      // Smoother zooming
      zoomSpeed={0.5}
    />
  );
}

// Room-specific lighting
function RoomLighting({ currentRoom }: { currentRoom: number }) {
  const { room3State } = useGameState();
  const powered = room3State.devicePowered;

  if (currentRoom === 2) {
    // Room 3 - Dark mechanical room, brighter when powered
    return (
      <>
        {/* Ambient light - brighter when powered */}
        <ambientLight
          intensity={powered ? 0.4 : 0.15}
          color={powered ? '#3a5a7a' : '#1a2030'}
        />

        {/* Main directional light */}
        <directionalLight
          position={[0, 10, -5]}
          intensity={powered ? 0.8 : 0.3}
          color={powered ? '#6688cc' : '#4466aa'}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={25}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
        />

        {/* Fill light from front */}
        <directionalLight
          position={[0, 3, 8]}
          intensity={powered ? 0.3 : 0.1}
          color={powered ? '#4a6a8a' : '#334455'}
        />

        {/* Additional lights when powered */}
        {powered && (
          <>
            <directionalLight
              position={[-5, 5, 0]}
              intensity={0.3}
              color="#5588aa"
            />
            <directionalLight
              position={[5, 5, 0]}
              intensity={0.3}
              color="#5588aa"
            />
          </>
        )}
      </>
    );
  }

  // Default lighting for other rooms
  return (
    <>
      {/* Ambient lighting */}
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
    </>
  );
}

// Room-specific floor
function RoomFloor({ currentRoom }: { currentRoom: number }) {
  if (currentRoom === 2) {
    // Room 3 - Industrial metal floor
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1]} receiveShadow>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial
          color="#0a0a10"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
    );
  }

  // Default wooden floor
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        color="#2a1e12"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

// Main scene component
export function Scene() {
  const { currentRoom, room3State } = useGameState();
  const powered = room3State.devicePowered;

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera
        makeDefault
        fov={currentRoom === 2 ? 55 : 60}
        position={currentRoom === 2 ? [0, 2.5, 6] : [0, 1.6, 4]}
      />
      <CameraController />

      {/* Room-specific lighting */}
      <RoomLighting currentRoom={currentRoom} />

      {/* Dust particles - only for non-mechanical rooms */}
      {currentRoom !== 2 && <DustParticles />}

      {/* Room-specific floor */}
      <RoomFloor currentRoom={currentRoom} />

      {/* Room content based on current room */}
      {currentRoom === 0 && <Room1 />}
      {currentRoom === 1 && <Room2 />}
      {currentRoom === 2 && <Room3 />}

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={currentRoom === 2 ? (powered ? 0.5 : 0.3) : 0.5}
          luminanceThreshold={currentRoom === 2 ? (powered ? 0.5 : 0.7) : 0.6}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
        <Vignette
          offset={currentRoom === 2 ? (powered ? 0.3 : 0.4) : 0.3}
          darkness={currentRoom === 2 ? (powered ? 0.3 : 0.6) : 0.4}
          blendFunction={BlendFunction.NORMAL}
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.001, 0.001)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>

      {/* Fog for Room 3 - lighter when powered */}
      {currentRoom === 2 && (
        <fog attach="fog" args={[powered ? '#101520' : '#050510', powered ? 10 : 8, powered ? 25 : 20]} />
      )}
    </>
  );
}
