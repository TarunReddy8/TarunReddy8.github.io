// The 3D layer: a real depth starfield, a floating glowing centerpiece,
// and a camera rig that drifts with the cursor and scroll.
// Rendered by three.js via react-three-fiber, entirely on the GPU.
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const REDUCED = typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches

function Centerpiece({ position }) {
  const group = useRef()
  const core = useRef()
  useFrame((state, dt) => {
    if (REDUCED) return
    group.current.rotation.y += dt * 0.18
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x, state.pointer.y * 0.25, 0.04)
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.04
    core.current.scale.setScalar(pulse)
  })
  return (
    <Float speed={REDUCED ? 0 : 1.3} rotationIntensity={0.5} floatIntensity={1.1}>
      <group ref={group} position={position}>
        {/* outer wireframe shell */}
        <mesh>
          <icosahedronGeometry args={[2.1, 1]} />
          <meshBasicMaterial wireframe color="#818cf8" transparent opacity={0.32} />
        </mesh>
        {/* mid ring */}
        <mesh rotation={[Math.PI / 2.6, 0, 0.4]}>
          <torusGeometry args={[2.7, 0.015, 8, 96]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.5} />
        </mesh>
        {/* glowing core */}
        <mesh ref={core}>
          <icosahedronGeometry args={[1.15, 4]} />
          <meshStandardMaterial color="#0b1030" emissive="#4c5bd4"
            emissiveIntensity={1.6} roughness={0.25} metalness={0.85} />
        </mesh>
        <Sparkles count={40} scale={5} size={2.4} speed={REDUCED ? 0 : 0.35}
          color="#a5b4fc" opacity={0.7} />
      </group>
    </Float>
  )
}

function CameraRig() {
  const target = useMemo(() => new THREE.Vector3(), [])
  useFrame((state) => {
    if (REDUCED) return
    const { camera, pointer } = state
    const scroll = typeof window !== 'undefined' ? window.scrollY : 0
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.7, 0.035)
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y, -pointer.y * 0.5 - scroll * 0.0012, 0.035)
    camera.lookAt(target)
  })
  return null
}

export default function Scene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 900
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={REDUCED ? 'demand' : 'always'}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[7, 5, 6]} intensity={60} color="#67e8f9" />
        <pointLight position={[-7, -4, 5]} intensity={45} color="#818cf8" />
        <Stars radius={90} depth={60} count={4500} factor={4}
          saturation={0} fade speed={REDUCED ? 0 : 0.5} />
        <Centerpiece position={isMobile ? [0, 2.6, -3] : [3.4, 0.5, 0]} />
        <CameraRig />
        {!REDUCED && (
          <EffectComposer>
            <Bloom intensity={0.65} luminanceThreshold={0.18} mipmapBlur />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
