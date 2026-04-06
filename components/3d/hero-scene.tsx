'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

/* ── Wireframe outer shell ─────────────────────────────────── */
function WireframeShell() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.x = clock.getElapsedTime() * 0.08
    ref.current.rotation.y = clock.getElapsedTime() * 0.13
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[2.6, 2]} />
      <meshBasicMaterial
        color="#34d874"
        wireframe
        transparent
        opacity={0.18}
      />
    </mesh>
  )
}

/* ── Distorted inner orb ────────────────────────────────────── */
function DistortedOrb() {
  return (
    <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.8}>
      <Sphere args={[1.7, 64, 64]}>
        <MeshDistortMaterial
          color="#0d1a12"
          distort={0.38}
          speed={2.5}
          roughness={0.1}
          metalness={0.4}
          transparent
          opacity={0.92}
        />
      </Sphere>
      {/* Green glow ring */}
      <Sphere args={[1.72, 32, 32]}>
        <meshBasicMaterial color="#34d874" transparent opacity={0.06} side={THREE.BackSide} />
      </Sphere>
    </Float>
  )
}

/* ── Orbiting particles ─────────────────────────────────────── */
function OrbitRing({ radius, speed, count }: { radius: number; speed: number; count: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      arr[i * 3] = Math.cos(angle) * radius
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.4
      arr[i * 3 + 2] = Math.sin(angle) * radius
    }
    return arr
  }, [count, radius])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * speed
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#34d874" size={0.04} transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

/* ── Outer glow sphere ──────────────────────────────────────── */
function OuterGlow() {
  return (
    <Sphere args={[2.9, 32, 32]}>
      <meshBasicMaterial color="#34d874" transparent opacity={0.025} side={THREE.BackSide} />
    </Sphere>
  )
}

/* ── Scene ──────────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#34d874" distance={8} decay={2} />
      <pointLight position={[4, 4, 4]} intensity={0.8} color="#6366f1" distance={12} decay={2} />

      <Stars radius={80} depth={50} count={1800} factor={3} saturation={0} fade speed={0.5} />

      <WireframeShell />
      <DistortedOrb />
      <OrbitRing radius={2.15} speed={0.25} count={60} />
      <OrbitRing radius={2.45} speed={-0.15} count={40} />
      <OuterGlow />
    </>
  )
}

/* ── Export ─────────────────────────────────────────────────── */
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 52 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Scene />
    </Canvas>
  )
}
