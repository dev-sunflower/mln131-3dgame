'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameState } from '../../hooks/useGameState';

// Gear data
const gearData = [
  { id: 'economy-gear', slot: 'economy', label: 'Multi-sector Economy', labelVi: 'Kinh tế nhiều thành phần', color: '#b5894a' },
  { id: 'politics-gear', slot: 'politics', label: 'Proletariat Dictatorship', labelVi: 'Chuyên chính vô sản', color: '#8b6914' },
  { id: 'social-gear', slot: 'social', label: 'Class Transformation', labelVi: 'Chuyển đổi giai cấp', color: '#a07030' },
  { id: 'culture-gear', slot: 'culture', label: 'Socialist Culture', labelVi: 'Văn hóa XHCN', color: '#c4994a' },
];

// Slot positions on the orrery
const slotPositions: { [key: string]: [number, number, number] } = {
  economy: [-0.4, 0.3, 0.3],
  politics: [0.4, 0.3, 0.3],
  social: [-0.4, 0.3, -0.3],
  culture: [0.4, 0.3, -0.3],
};

// Hidden gear positions in the room
const hiddenGearPositions: { [key: string]: [number, number, number] } = {
  'economy-gear': [-3, 1.2, -1],
  'politics-gear': [3, 0.5, 0],
  'social-gear': [0, 2.5, -2.5],
  'culture-gear': [-2, 0.3, 1],
};

// Rotating gear component
function Gear({
  position,
  size = 0.15,
  color = '#b5894a',
  speed = 1,
  teeth = 12,
  onClick,
  isCollected = false,
  label,
  showLabel = false,
}: {
  position: [number, number, number];
  size?: number;
  color?: string;
  speed?: number;
  teeth?: number;
  onClick?: () => void;
  isCollected?: boolean;
  label?: string;
  showLabel?: boolean;
}) {
  const gearRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (gearRef.current && !isCollected) {
      gearRef.current.rotation.z += 0.01 * speed;
    }
  });

  if (isCollected) return null;

  return (
    <group
      ref={gearRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main gear body */}
      <mesh castShadow>
        <cylinderGeometry args={[size, size, 0.03, teeth * 2]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.8}
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* Center hole */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[size * 0.2, size * 0.2, 0.04, 16]} />
        <meshStandardMaterial color="#1a1208" roughness={0.9} />
      </mesh>

      {/* Gear teeth */}
      {[...Array(teeth)].map((_, i) => {
        const angle = (i / teeth) * Math.PI * 2;
        const x = Math.cos(angle) * size * 0.95;
        const z = Math.sin(angle) * size * 0.95;
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, -angle, 0]} castShadow>
            <boxGeometry args={[size * 0.15, 0.03, size * 0.1]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.8} />
          </mesh>
        );
      })}

      {showLabel && hovered && label && (
        <Html position={[0, 0.2, 0]} center>
          <div className="text-brass-gold text-xs font-display whitespace-nowrap bg-black/80 px-2 py-1 rounded">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// Central Orrery device
function Orrery() {
  const {
    room2State,
    placeGear,
    removeGear,
    activateMachine,
    examineMode,
    enterExamineMode,
  } = useGameState();

  const orreryRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Check if all gears are correctly placed
  const allGearsPlaced = Object.entries(room2State.gearsPlaced).every(
    ([slot, gearId]) => gearId === `${slot}-gear`
  );

  // Handle gear slot click
  const handleSlotClick = (slotId: string) => {
    const placedGear = room2State.gearsPlaced[slotId];

    if (placedGear) {
      // Remove gear if already placed
      removeGear(slotId);
    } else if (room2State.gearsCollected.length > 0) {
      // Place the first collected gear (simplified - could add selection UI)
      const gearToPlace = room2State.gearsCollected.find(
        (g) => g === `${slotId}-gear`
      ) || room2State.gearsCollected[0];
      placeGear(slotId, gearToPlace);

      // Check for completion after placement
      setTimeout(() => {
        const state = useGameState.getState();
        const nowAllPlaced = Object.entries(state.room2State.gearsPlaced).every(
          ([slot, gearId]) => gearId === `${slot}-gear`
        );
        if (nowAllPlaced && !state.room2State.machineActivated) {
          activateMachine();
        }
      }, 100);
    }
  };

  useFrame((state) => {
    if (orreryRef.current && room2State.machineActivated) {
      orreryRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group
      ref={orreryRef}
      position={[0, 1, -1]}
      onClick={() => !examineMode && enterExamineMode('orrery')}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base platform */}
      <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1, 0.1, 32]} />
        <meshStandardMaterial color="#2a1810" roughness={0.7} />
      </mesh>

      {/* Central pillar */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.6, 16]} />
        <meshStandardMaterial color="#8b6914" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Gear slots */}
      {Object.entries(slotPositions).map(([slotId, pos]) => {
        const placedGearId = room2State.gearsPlaced[slotId];
        const isCorrect = placedGearId === `${slotId}-gear`;

        return (
          <group key={slotId} position={pos}>
            {/* Slot base */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                handleSlotClick(slotId);
              }}
              castShadow
            >
              <cylinderGeometry args={[0.18, 0.18, 0.05, 16]} />
              <meshStandardMaterial
                color={placedGearId ? (isCorrect ? '#2a5a2a' : '#5a2a2a') : '#3a3a3a'}
                roughness={0.6}
                metalness={0.5}
                emissive={isCorrect ? '#00ff00' : placedGearId ? '#ff0000' : '#000000'}
                emissiveIntensity={0.2}
              />
            </mesh>

            {/* Slot label */}
            <Html position={[0, -0.15, 0]} center>
              <div className="text-brass-gold/60 text-[10px] font-display uppercase whitespace-nowrap">
                {slotId}
              </div>
            </Html>

            {/* Placed gear */}
            {placedGearId && (
              <Gear
                position={[0, 0.05, 0]}
                size={0.15}
                color={gearData.find((g) => g.id === placedGearId)?.color || '#b5894a'}
                speed={room2State.machineActivated ? 2 : 0}
                teeth={10}
              />
            )}
          </group>
        );
      })}

      {/* Decorative arms */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.4, 0.1, Math.sin(angle) * 0.4]}
            rotation={[0, -angle, 0]}
            castShadow
          >
            <boxGeometry args={[0.4, 0.02, 0.03]} />
            <meshStandardMaterial color="#b5894a" metalness={0.8} roughness={0.3} />
          </mesh>
        );
      })}

      {/* Central orb (glows when activated) */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={room2State.machineActivated ? '#ffaa00' : '#4a3a2a'}
          emissive={room2State.machineActivated ? '#ffaa00' : '#000000'}
          emissiveIntensity={room2State.machineActivated ? 1 : 0}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Hover hint */}
      {hovered && !examineMode && (
        <Html position={[0, 0.8, 0]} center>
          <div className="text-brass-gold text-xs font-display whitespace-nowrap">
            Click to examine orrery
          </div>
        </Html>
      )}
    </group>
  );
}

// Collectible gears hidden in the room
function HiddenGears() {
  const { room2State, collectGear } = useGameState();

  return (
    <>
      {gearData.map((gear) => {
        const isCollected = room2State.gearsCollected.includes(gear.id) ||
          Object.values(room2State.gearsPlaced).includes(gear.id);

        return (
          <Gear
            key={gear.id}
            position={hiddenGearPositions[gear.id]}
            size={0.12}
            color={gear.color}
            teeth={10}
            onClick={() => !isCollected && collectGear(gear.id)}
            isCollected={isCollected}
            label={gear.label}
            showLabel={true}
          />
        );
      })}
    </>
  );
}

// Mechanical pipes decoration
function Pipes() {
  return (
    <group>
      {/* Vertical pipes */}
      {[-3, -2, 2, 3].map((x, idx) => (
        <mesh key={idx} position={[x, 1.5, -2.8]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 3, 16]} />
          <meshStandardMaterial color="#5a4a3a" metalness={0.6} roughness={0.5} />
        </mesh>
      ))}

      {/* Horizontal pipes */}
      <mesh position={[0, 2.8, -2.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 6, 16]} />
        <meshStandardMaterial color="#5a4a3a" metalness={0.6} roughness={0.5} />
      </mesh>

      {/* Pipe joints */}
      {[-3, -2, 2, 3].map((x, idx) => (
        <mesh key={idx} position={[x, 2.8, -2.8]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#8b6914" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// Wall panels
function WallPanels() {
  return (
    <>
      {/* Back wall */}
      <mesh position={[0, 2, -3]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#1a1510" roughness={0.95} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#1a1510" roughness={0.95} />
      </mesh>

      <mesh position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#1a1510" roughness={0.95} />
      </mesh>

      {/* Decorative panels */}
      {[-2, 0, 2].map((x, idx) => (
        <mesh key={idx} position={[x, 1.5, -2.95]} castShadow>
          <boxGeometry args={[1.5, 2.5, 0.05]} />
          <meshStandardMaterial color="#2a2018" roughness={0.8} />
        </mesh>
      ))}
    </>
  );
}

// Gear count display
function GearInventory() {
  const { room2State } = useGameState();

  return (
    <Html position={[0, 3.5, 0]} center>
      <div className="text-brass-gold font-display text-sm bg-black/80 px-4 py-2 rounded border border-brass-gold/30">
        Gears Collected: {room2State.gearsCollected.length} / 4
        {room2State.machineActivated && (
          <span className="ml-2 text-green-400">✓ Machine Activated!</span>
        )}
      </div>
    </Html>
  );
}

// Main Room 2 component
export function Room2() {
  const { examineMode, exitExamineMode } = useGameState();

  return (
    <group>
      <WallPanels />
      <Pipes />
      <Orrery />
      <HiddenGears />
      <GearInventory />

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
