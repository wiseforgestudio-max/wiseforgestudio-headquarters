'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

/* ── Cursor-reactive camera ─────────────────────────────────── */
function CursorCamera({
  mouseRef,
}: {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}) {
  const { camera } = useThree()
  useFrame(() => {
    camera.position.x += (mouseRef.current.x * 1.4 - camera.position.x) * 0.04
    camera.position.y += (mouseRef.current.y * 0.7 + 1.5 - camera.position.y) * 0.04
    camera.lookAt(0, 0.5, 0)
  })
  return null
}

/* ── Atmospheric fog ────────────────────────────────────────── */
function SceneFog() {
  const { scene } = useThree()
  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x050508, 0.055)
    return () => {
      scene.fog = null
    }
  }, [scene])
  return null
}

/* ── Infinite grid floor ────────────────────────────────────── */
function GridFloor() {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(80, 80, 0x34d874, 0x0a2016)
    g.position.y = -2.8
    const mat = g.material as THREE.LineBasicMaterial
    mat.transparent = true
    mat.opacity = 0.45
    return g
  }, [])
  return <primitive object={grid} />
}

/* ── Central crystal core ───────────────────────────────────── */
function CrystalCore() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.11
    groupRef.current.rotation.x = Math.sin(t * 0.07) * 0.06
  })

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* Outer dodecahedron wireframe */}
      <mesh>
        <dodecahedronGeometry args={[2.5, 0]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.09} />
      </mesh>

      {/* Mid icosahedron wireframe — counter-rotates via float */}
      <Float speed={0.5} rotationIntensity={0.15} floatIntensity={0}>
        <mesh>
          <icosahedronGeometry args={[1.85, 1]} />
          <meshBasicMaterial color="#34d874" wireframe transparent opacity={0.14} />
        </mesh>
      </Float>

      {/* Inner distorted sphere */}
      <Float speed={1.2} floatIntensity={0.35} rotationIntensity={0.2}>
        <Sphere args={[1.05, 64, 64]}>
          <MeshDistortMaterial
            color="#081410"
            distort={0.38}
            speed={2.2}
            roughness={0.04}
            metalness={0.96}
            transparent
            opacity={0.95}
          />
        </Sphere>
        {/* Glow shell */}
        <Sphere args={[1.1, 32, 32]}>
          <meshBasicMaterial
            color="#34d874"
            transparent
            opacity={0.06}
            side={THREE.BackSide}
          />
        </Sphere>
      </Float>

      {/* Core light */}
      <pointLight color="#34d874" intensity={4} distance={9} decay={2} />
    </group>
  )
}

/* ── Floating geometric shard ───────────────────────────────── */
function Shard({
  pos,
  rot,
  color,
  size,
  wireframe = false,
}: {
  pos: [number, number, number]
  rot: [number, number, number]
  color: string
  size: number
  wireframe?: boolean
}) {
  const ref = useRef<THREE.Mesh>(null)
  const speed = useMemo(() => 0.12 + Math.random() * 0.22, [])
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])
  const amp = useMemo(() => 0.12 + Math.random() * 0.22, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.x = rot[0] + t * speed * 0.65
    ref.current.rotation.y = rot[1] + t * speed
    ref.current.position.y = pos[1] + Math.sin(t * 0.55 + phase) * amp
  })

  return (
    <mesh ref={ref} position={pos}>
      <octahedronGeometry args={[size, 0]} />
      {wireframe ? (
        <meshBasicMaterial color={color} wireframe transparent opacity={0.38} />
      ) : (
        <meshStandardMaterial
          color={color}
          roughness={0.05}
          metalness={0.9}
          transparent
          opacity={0.82}
          emissive={color}
          emissiveIntensity={0.18}
        />
      )}
    </mesh>
  )
}

/* ── Orbiting particle halo ─────────────────────────────────── */
function HaloRing({
  y = 0,
  radius = 3.5,
  count = 100,
  color = '#34d874',
  speed = 0.15,
  tilt = 0,
}: {
  y?: number
  radius?: number
  count?: number
  color?: string
  speed?: number
  tilt?: number
}) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const jitter = (Math.random() - 0.5) * 0.2
      arr[i * 3] = Math.cos(angle) * (radius + jitter)
      arr[i * 3 + 1] = y + (Math.random() - 0.5) * 0.28
      arr[i * 3 + 2] = Math.sin(angle) * (radius + jitter)
    }
    return arr
  }, [count, radius, y])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * speed
    ref.current.rotation.z = tilt
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.055} transparent opacity={0.72} sizeAttenuation />
    </points>
  )
}

/* ── Particle atmosphere ────────────────────────────────────── */
function ParticleAtmosphere() {
  const ref = useRef<THREE.Points>(null)
  const COUNT = 650

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)
    const green = new THREE.Color('#34d874')
    const indigo = new THREE.Color('#6366f1')
    const white = new THREE.Color('#c0c0d0')

    for (let i = 0; i < COUNT; i++) {
      const r = 2.8 + Math.random() * 4.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55
      pos[i * 3 + 2] = r * Math.cos(phi)

      const rnd = Math.random()
      const c = rnd < 0.5 ? green : rnd < 0.78 ? indigo : white
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.022
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.042} vertexColors transparent opacity={0.62} sizeAttenuation />
    </points>
  )
}

/* ── Scene ──────────────────────────────────────────────────── */
function Scene({
  mouseRef,
}: {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}) {
  return (
    <>
      <SceneFog />
      <CursorCamera mouseRef={mouseRef} />

      {/* Lighting */}
      <ambientLight intensity={0.07} />
      <pointLight position={[7, 6, 3]} intensity={1.3} color="#6366f1" distance={20} decay={2} />
      <pointLight position={[-6, 3, -4]} intensity={0.9} color="#34d874" distance={18} decay={2} />
      <pointLight position={[0, -3, 5]} intensity={0.5} color="#34d874" distance={12} decay={2} />

      <Stars radius={90} depth={55} count={1600} factor={3} saturation={0} fade speed={0.22} />

      <GridFloor />
      <CrystalCore />
      <ParticleAtmosphere />

      {/* Halo rings */}
      <HaloRing y={0.6} radius={3.1} count={110} color="#34d874" speed={0.19} />
      <HaloRing y={0.1} radius={3.65} count={75} color="#6366f1" speed={-0.12} tilt={0.28} />
      <HaloRing y={-0.4} radius={4.3} count={55} color="#34d874" speed={0.08} tilt={-0.18} />

      {/* Solid floating shards */}
      <Shard pos={[-3.8, 1.3, -1.2]} rot={[0.5, 0.3, 0.1]} color="#34d874" size={0.3} />
      <Shard pos={[3.5, -0.7, -0.9]} rot={[0.2, 0.9, 0.1]} color="#6366f1" size={0.38} />
      <Shard pos={[-3.1, -1.5, 0.9]} rot={[0.8, 0.2, 0.5]} color="#34d874" size={0.22} />
      <Shard pos={[2.9, 2.1, -1.4]} rot={[0.4, 0.6, 0.3]} color="#6366f1" size={0.27} />
      <Shard pos={[0.9, 3.1, -1.9]} rot={[0.1, 0.4, 0.7]} color="#34d874" size={0.18} />
      <Shard pos={[-1.6, -2.9, 0.6]} rot={[0.6, 0.3, 0.2]} color="#6366f1" size={0.24} />

      {/* Wireframe larger shards */}
      <Shard pos={[4.6, 0.6, -2.6]} rot={[0.3, 0.5, 0.2]} color="#34d874" size={0.68} wireframe />
      <Shard pos={[-4.3, -0.4, -2.1]} rot={[0.7, 0.2, 0.4]} color="#6366f1" size={0.58} wireframe />
      <Shard pos={[1.3, -3.3, -1.6]} rot={[0.2, 0.8, 0.1]} color="#34d874" size={0.46} wireframe />
    </>
  )
}

/* ── Export ─────────────────────────────────────────────────── */
export default function HeroScene() {
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 1.6
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 1.5, 8.5], fov: 48 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Scene mouseRef={mouseRef} />
    </Canvas>
  )
}
