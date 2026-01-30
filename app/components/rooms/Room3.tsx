'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameState } from '../../hooks/useGameState';

// Component data
const componentData = [
  {
    id: 'innovation',
    label: 'Innovation Module',
    labelVi: 'Mô-đun Đổi mới',
    color: '#00d4ff',
    emissive: '#0088aa',
    position: [-3, 1.2, 0] as [number, number, number],
  },
  {
    id: 'digital',
    label: 'Digital Core',
    labelVi: 'Lõi Kỹ thuật số',
    color: '#bd00ff',
    emissive: '#7700aa',
    position: [3, 0.8, -1] as [number, number, number],
  },
  {
    id: 'justice',
    label: 'Justice Stabilizer',
    labelVi: 'Bộ cân bằng Công lý',
    color: '#ffd700',
    emissive: '#aa8800',
    position: [0, 2, -2.5] as [number, number, number],
  },
];

// Slot positions on the workbench device
const slotPositions: { [key: string]: [number, number, number] } = {
  innovation: [-0.3, 0.15, 0.15],
  digital: [0.3, 0.15, 0.15],
  justice: [0, 0.15, -0.15],
};

// Glowing component for collection
function Component({
  data,
  isCollected,
  onClick,
}: {
  data: typeof componentData[0];
  isCollected: boolean;
  onClick: () => void;
}) {
  const componentRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (componentRef.current && !isCollected) {
      componentRef.current.rotation.y += 0.02;
      componentRef.current.position.y = data.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  if (isCollected) return null;

  return (
    <group
      ref={componentRef}
      position={data.position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Crystal/chip shape */}
      <mesh castShadow>
        <octahedronGeometry args={[0.12]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.emissive}
          emissiveIntensity={hovered ? 1 : 0.5}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glow sphere */}
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={hovered ? 0.3 : 0.15}
        />
      </mesh>

      {hovered && (
        <Html position={[0, 0.3, 0]} center>
          <div
            className="text-xs font-display whitespace-nowrap bg-black/80 px-2 py-1 rounded"
            style={{ color: data.color }}
          >
            {data.label}
          </div>
        </Html>
      )}
    </group>
  );
}

// Central workbench with device
function Workbench() {
  const {
    room3State,
    placeComponent,
    collectComponent,
    powerDevice,
    obtainBadge,
    examineMode,
    enterExamineMode,
  } = useGameState();

  const deviceRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Check if all components are placed
  const allComponentsPlaced = componentData.every((c) =>
    room3State.componentsPlaced.includes(c.id)
  );

  // Handle slot click
  const handleSlotClick = (componentId: string) => {
    if (room3State.componentsCollected.includes(componentId)) {
      placeComponent(componentId);

      // Check for completion
      setTimeout(() => {
        const state = useGameState.getState();
        const nowAllPlaced = componentData.every((c) =>
          state.room3State.componentsPlaced.includes(c.id)
        );
        if (nowAllPlaced && !state.room3State.devicePowered) {
          powerDevice();
        }
      }, 100);
    }
  };

  useFrame((state) => {
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
        {componentData.map((component) => {
          const pos = slotPositions[component.id];
          const isPlaced = room3State.componentsPlaced.includes(component.id);
          const canPlace = room3State.componentsCollected.includes(component.id);

          return (
            <group key={component.id} position={pos}>
              {/* Slot base */}
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  handleSlotClick(component.id);
                }}
              >
                <cylinderGeometry args={[0.1, 0.1, 0.05, 6]} />
                <meshStandardMaterial
                  color={isPlaced ? component.color : canPlace ? '#3a3a4a' : '#2a2a2a'}
                  emissive={isPlaced ? component.emissive : canPlace ? '#333344' : '#000000'}
                  emissiveIntensity={isPlaced ? 0.8 : canPlace ? 0.3 : 0}
                  roughness={0.4}
                  metalness={0.6}
                />
              </mesh>

              {/* Placed component visualization */}
              {isPlaced && (
                <mesh position={[0, 0.08, 0]}>
                  <octahedronGeometry args={[0.08]} />
                  <meshStandardMaterial
                    color={component.color}
                    emissive={component.emissive}
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
                  style={{ color: isPlaced ? component.color : '#666' }}
                >
                  {component.id}
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
              🎓 FPT Student ID - Click to claim!
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

// Collectible components scattered in room
function CollectibleComponents() {
  const { room3State, collectComponent } = useGameState();

  return (
    <>
      {componentData.map((component) => {
        const isCollected =
          room3State.componentsCollected.includes(component.id) ||
          room3State.componentsPlaced.includes(component.id);

        return (
          <Component
            key={component.id}
            data={component}
            isCollected={isCollected}
            onClick={() => !isCollected && collectComponent(component.id)}
          />
        );
      })}
    </>
  );
}

// Victorian brass instruments mixed with modern tech
function LabEquipment() {
  return (
    <group>
      {/* Old brass telescope */}
      <group position={[-2.5, 1, -2]} rotation={[0.2, 0.3, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.8, 16]} />
          <meshStandardMaterial color="#b5894a" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Circuit boards on wall */}
      {[-1.5, 1.5].map((x, idx) => (
        <group key={idx} position={[x, 2, -2.9]}>
          <mesh>
            <boxGeometry args={[0.4, 0.6, 0.02]} />
            <meshStandardMaterial color="#1a3a2a" roughness={0.6} />
          </mesh>
          {/* LED lights */}
          {[...Array(5)].map((_, i) => (
            <mesh key={i} position={[-0.12 + i * 0.06, 0.2, 0.02]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial
                color={['#00ff00', '#ff0000', '#00ff00', '#ffaa00', '#00ff00'][i]}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Globe with Vietnam highlighted */}
      <group position={[2.5, 1.5, -1.5]}>
        <mesh>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial
            color="#2a4a6a"
            roughness={0.6}
            metalness={0.3}
          />
        </mesh>
        {/* Vietnam marker */}
        <mesh position={[0.15, 0.1, 0.15]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
        {/* Stand */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.03, 0.08, 0.2, 16]} />
          <meshStandardMaterial color="#b5894a" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Glowing neon accent lines */}
      {[
        { pos: [-4, 1.5, -2.9], rot: [0, 0, 0], color: '#00d4ff' },
        { pos: [4, 1.5, -2.9], rot: [0, 0, 0], color: '#bd00ff' },
        { pos: [0, 3.5, -2.9], rot: [0, 0, Math.PI / 2], color: '#ffd700' },
      ].map((line, idx) => (
        <mesh
          key={idx}
          position={line.pos as [number, number, number]}
          rotation={line.rot as [number, number, number]}
        >
          <boxGeometry args={[0.02, 2, 0.01]} />
          <meshBasicMaterial color={line.color} />
        </mesh>
      ))}
    </group>
  );
}

// Walls with hybrid aesthetic
function Walls() {
  return (
    <>
      {/* Back wall */}
      <mesh position={[0, 2, -3]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#0a0a10" roughness={0.95} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#0a0a10" roughness={0.95} />
      </mesh>

      <mesh position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#0a0a10" roughness={0.95} />
      </mesh>

      {/* Victorian wood paneling at bottom */}
      <mesh position={[0, 0.5, -2.95]}>
        <boxGeometry args={[11, 1.2, 0.05]} />
        <meshStandardMaterial color="#2a1810" roughness={0.8} />
      </mesh>
    </>
  );
}

// Component inventory display
function ComponentInventory() {
  const { room3State } = useGameState();

  return (
    <Html position={[0, 3.5, 0]} center>
      <div className="font-display text-sm bg-black/80 px-4 py-2 rounded border border-brass-gold/30">
        <div className="text-brass-gold mb-1">Components:</div>
        <div className="flex gap-2">
          {componentData.map((c) => {
            const collected = room3State.componentsCollected.includes(c.id);
            const placed = room3State.componentsPlaced.includes(c.id);
            return (
              <div
                key={c.id}
                className="text-xs px-2 py-1 rounded"
                style={{
                  backgroundColor: placed ? c.color + '40' : collected ? c.color + '20' : '#333',
                  color: placed || collected ? c.color : '#666',
                  border: `1px solid ${placed ? c.color : '#444'}`,
                }}
              >
                {c.id.charAt(0).toUpperCase()}
                {placed && ' ✓'}
              </div>
            );
          })}
        </div>
        {room3State.devicePowered && (
          <div className="mt-2 text-green-400 text-xs">✓ Device Powered!</div>
        )}
      </div>
    </Html>
  );
}

// Main Room 3 component
export function Room3() {
  const { examineMode, exitExamineMode } = useGameState();

  return (
    <group>
      <Walls />
      <Workbench />
      <CollectibleComponents />
      <LabEquipment />
      <ComponentInventory />

      {/* Additional point light for tech glow */}
      <pointLight position={[0, 2, 0]} color="#4488ff" intensity={0.3} distance={5} />

      {/* Exit examine mode hint */}
      {examineMode && (
        <Html fullscreen>
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2">
            <button
              onClick={exitExamineMode}
              className="px-4 py-2 bg-black/80 border border-brass-gold text-brass-gold font-display text-sm rounded hover:bg-brass-gold/20 transition-colors"
            >
              Press ESC or click here to exit
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
