"use client";
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Particle Universe Component
function ParticleUniverse({ scrollProgress = 0 }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate 10,000 particles in a sphere
  const particles = useMemo(() => {
    const positions = new Float32Array(10000 * 3);
    const colors = new Float32Array(10000 * 3);
    
    for (let i = 0; i < 10000; i++) {
      // Spherical distribution
      const radius = Math.random() * 50 + 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Color gradient: Blue → Green → Purple
      const colorPhase = i / 10000;
      if (colorPhase < 0.33) {
        // Blue phase
        colors[i * 3] = 0.02; // R
        colors[i * 3 + 1] = 0.61; // G
        colors[i * 3 + 2] = 0.75; // B (#059cc0)
      } else if (colorPhase < 0.66) {
        // Green phase
        colors[i * 3] = 0.01; // R
        colors[i * 3 + 1] = 0.7; // G
        colors[i * 3 + 2] = 0.55; // B (#03b28c)
      } else {
        // Purple phase
        colors[i * 3] = 0.5; // R
        colors[i * 3 + 1] = 0.2; // G
        colors[i * 3 + 2] = 0.8; // B
      }
    }
    
    return { positions, colors };
  }, []);

  // Animate particles based on scroll and time
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Rotation based on scroll
    pointsRef.current.rotation.x = scrollProgress * Math.PI * 2;
    pointsRef.current.rotation.y = time * 0.05;
    
    // Pulsing effect
    const scale = 1 + Math.sin(time * 0.5) * 0.1;
    pointsRef.current.scale.set(scale, scale, scale);
    
    // Update particle positions for wave effect
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Sinusoidal wave
      positions[i + 1] = y + Math.sin(time + x * 0.01) * 0.05;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points
      ref={pointsRef}
      positions={particles.positions}
      colors={particles.colors}
      stride={3}
    >
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Main WebGL Universe Component
export default function WebGLUniverse({ scrollProgress = 0 }: { scrollProgress: number }) {
  return (
    <div className="fixed inset-0 -z-30 opacity-40">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ParticleUniverse scrollProgress={scrollProgress} />
        {/* Subtle camera rotation */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate
          autoRotateSpeed={0.2}
        />
      </Canvas>
    </div>
  );
}
