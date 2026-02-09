"use client"

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * InnerSphere component - renders the translucent sphere with particles
 */
function InnerSphere() {
  const sphereRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const innerParticlesRef = useRef<THREE.Points>(null)

  // Create particle geometry for outer glow
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const count = 200
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count * 3; i += 3) {
      // Create particles in a spherical distribution
      const radius = 1.2 + Math.random() * 0.3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)

      positions[i] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i + 2] = radius * Math.cos(phi)
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])

  // Create inner particle geometry
  const innerParticlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const count = 100
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count * 3; i += 3) {
      // Create particles inside the sphere
      const radius = Math.random() * 0.8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)

      positions[i] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i + 2] = radius * Math.cos(phi)
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])

  // Animate the sphere and particles
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (sphereRef.current) {
      // Gentle rotation
      sphereRef.current.rotation.y = time * 0.1
      sphereRef.current.rotation.x = Math.sin(time * 0.2) * 0.1
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.05
      particlesRef.current.rotation.x = time * 0.03
    }

    if (innerParticlesRef.current) {
      innerParticlesRef.current.rotation.y = -time * 0.08
      innerParticlesRef.current.rotation.z = time * 0.04
    }
  })

  return (
    <>
      {/* Main translucent sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color="#00ffff"
          transparent
          opacity={0.15}
          transmission={0.9}
          thickness={0.5}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1}
        />
      </mesh>

      {/* Outer particles with neon glow */}
      <points ref={particlesRef} geometry={particlesGeometry}>
        <pointsMaterial
          size={0.03}
          color="#00ffff"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Inner particles */}
      <points ref={innerParticlesRef} geometry={innerParticlesGeometry}>
        <pointsMaterial
          size={0.02}
          color="#ff00ff"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Ambient light */}
      <ambientLight intensity={0.3} />

      {/* Point lights for neon effect */}
      <pointLight position={[2, 2, 2]} intensity={0.5} color="#00ffff" />
      <pointLight position={[-2, -2, -2]} intensity={0.5} color="#ff00ff" />
      <pointLight position={[0, 2, -2]} intensity={0.3} color="#00ff00" />
    </>
  )
}

/**
 * KnowledgeSphere component - the main component with Canvas wrapper
 * This displays a beautiful 3D translucent sphere with particles representing knowledge
 */
interface KnowledgeSphereProps {
  className?: string
}

export function KnowledgeSphere({ className = '' }: KnowledgeSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Cleanup on unmount
  // No manual cleanup needed for R3F

  return (
    <div
      ref={containerRef}
      className={`knowledge-sphere-container ${className}`}
      style={{
        width: '120px',
        height: '120px',
        position: 'absolute',
        top: '50%',
        right: '-140px',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'low-power',
        }}
        style={{ background: 'transparent' }}
      >
        <InnerSphere />
      </Canvas>
    </div>
  )
}
