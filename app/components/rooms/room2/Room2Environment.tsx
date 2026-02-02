'use client';

import { useRef } from 'react';
import * as THREE from 'three';

export function Room2Environment() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#2a1810" roughness={0.9} />
      </mesh>

      {/* Back wall with red banner */}
      <group position={[0, 2.5, -4.5]}>
        <mesh receiveShadow>
          <planeGeometry args={[12, 6]} />
          <meshStandardMaterial color="#1a0808" roughness={0.95} />
        </mesh>
        
        {/* Large red banner */}
        <mesh position={[0, 0.5, 0.05]}>
          <planeGeometry args={[8, 3]} />
          <meshStandardMaterial color="#cc0000" roughness={0.7} />
        </mesh>

        {/* Hammer and sickle symbol (simplified) */}
        <mesh position={[0, 0.8, 0.06]}>
          <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
          <meshStandardMaterial color="#ffcc00" metalness={0.8} roughness={0.3} />
        </mesh>
        
        <mesh position={[-0.3, 0.3, 0.06]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.6, 0.1, 0.05]} />
          <meshStandardMaterial color="#ffcc00" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Side walls */}
      <mesh position={[-6, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#1a0808" roughness={0.95} />
      </mesh>

      <mesh position={[6, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#1a0808" roughness={0.95} />
      </mesh>

      {/* Bookshelves (left side) */}
      <group position={[-5, 1.5, -2]}>
        {[0, 1, 2].map((i) => (
          <group key={i} position={[0, i * 0.8, 0]}>
            <mesh>
              <boxGeometry args={[1.8, 0.05, 0.3]} />
              <meshStandardMaterial color="#3a2818" roughness={0.8} />
            </mesh>
            {/* Books */}
            {[...Array(8)].map((_, j) => (
              <mesh key={j} position={[-0.7 + j * 0.2, 0.15, 0]}>
                <boxGeometry args={[0.15, 0.25, 0.25]} />
                <meshStandardMaterial 
                  color={['#8b0000', '#b22222', '#dc143c', '#ff0000'][j % 4]} 
                  roughness={0.7} 
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Propaganda posters (right side) */}
      {[-1.5, 0, 1.5].map((z, idx) => (
        <group key={idx} position={[5.8, 2, z]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <planeGeometry args={[1, 1.4]} />
            <meshStandardMaterial 
              color={idx === 0 ? '#cc0000' : idx === 1 ? '#ffcc00' : '#cc0000'} 
              roughness={0.6} 
            />
          </mesh>
          {/* Frame */}
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[1.1, 1.5]} />
            <meshStandardMaterial color="#1a1208" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Red star decorations on ceiling */}
      {[-2, 0, 2].map((x, idx) => (
        <mesh key={idx} position={[x, 4.8, -1]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 5]} />
          <meshStandardMaterial 
            color="#cc0000" 
            emissive="#cc0000" 
            emissiveIntensity={0.3}
            roughness={0.5} 
          />
        </mesh>
      ))}

      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Red accent lights */}
      <pointLight position={[-3, 3, -3]} intensity={0.5} color="#ff0000" />
      <pointLight position={[3, 3, -3]} intensity={0.5} color="#ff0000" />
      <pointLight position={[0, 3, 2]} intensity={0.3} color="#ffcc00" />
    </group>
  );
}
