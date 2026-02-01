'use client';

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

// Static environment for Room 3
export function Room3Environment() {
  return (
    <group>
      <Walls />
      <LabEquipment />

      {/* Additional point light for tech glow */}
      <pointLight position={[0, 2, 0]} color="#4488ff" intensity={0.3} distance={5} />
    </group>
  );
}
