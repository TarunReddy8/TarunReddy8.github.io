// A 3D neural network that lives in the background: layered nodes, synaptic
// connections, and pulses of light that fire along the edges — the "AI" motif.
// Everything is instanced/buffered geometry so thousands of elements stay on the GPU.
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const REDUCED = typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches

// network topology: five layers fanning out in depth
const LAYERS = [4, 7, 9, 7, 4]
const LAYER_GAP = 4.2
const SPREAD_Y = 6.2
const SPREAD_Z = 4.5

function buildGraph() {
  const nodes = []
  LAYERS.forEach((count, li) => {
    const x = (li - (LAYERS.length - 1) / 2) * LAYER_GAP
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1)
      nodes.push({
        layer: li,
        base: new THREE.Vector3(
          x,
          (t - 0.5) * SPREAD_Y + (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * SPREAD_Z,
        ),
        phase: Math.random() * Math.PI * 2,
      })
    }
  })
  // connect each node to a few nodes in the next layer (sparse, brain-like)
  const edges = []
  let offset = 0
  for (let li = 0; li < LAYERS.length - 1; li++) {
    const start = offset
    const nextStart = offset + LAYERS[li]
    for (let a = 0; a < LAYERS[li]; a++) {
      const targets = new Set()
      const links = 2 + (Math.random() * 2 | 0)
      for (let k = 0; k < links; k++) {
        targets.add(nextStart + (Math.random() * LAYERS[li + 1] | 0))
      }
      targets.forEach((b) => edges.push({
        a: start + a, b,
        speed: 0.25 + Math.random() * 0.5,
        offset: Math.random(),
      }))
    }
    offset += LAYERS[li]
  }
  return { nodes, edges }
}

export default function NeuralNet({ position = [0, 0, -6] }) {
  const group = useRef()
  const nodesRef = useRef()
  const linesRef = useRef()
  const pulsesRef = useRef()

  const { nodes, edges } = useMemo(buildGraph, [])
  const nodeCount = nodes.length
  const edgeCount = edges.length

  // reusable buffers
  const linePositions = useMemo(() => new Float32Array(edgeCount * 6), [edgeCount])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const livePos = useMemo(() => nodes.map((n) => n.base.clone()), [nodes])

  useFrame((state) => {
    const t = REDUCED ? 0 : state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.05) * 0.25
      group.current.rotation.x = Math.cos(t * 0.04) * 0.12
    }

    // gently animate node positions (breathing network)
    for (let i = 0; i < nodeCount; i++) {
      const n = nodes[i]
      livePos[i].set(
        n.base.x,
        n.base.y + Math.sin(t * 0.6 + n.phase) * 0.18,
        n.base.z + Math.cos(t * 0.5 + n.phase) * 0.18,
      )
      dummy.position.copy(livePos[i])
      const s = 0.09 + (0.5 + 0.5 * Math.sin(t * 2 + n.phase)) * 0.05
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      nodesRef.current.setMatrixAt(i, dummy.matrix)
    }
    nodesRef.current.instanceMatrix.needsUpdate = true

    // update synapse lines to follow nodes
    for (let e = 0; e < edgeCount; e++) {
      const A = livePos[edges[e].a], B = livePos[edges[e].b]
      const o = e * 6
      linePositions[o] = A.x; linePositions[o + 1] = A.y; linePositions[o + 2] = A.z
      linePositions[o + 3] = B.x; linePositions[o + 4] = B.y; linePositions[o + 5] = B.z
    }
    linesRef.current.geometry.attributes.position.needsUpdate = true

    // fire pulses: a bright dot travels A -> B along each edge
    for (let e = 0; e < edgeCount; e++) {
      const edge = edges[e]
      const p = REDUCED ? 0.5 : (t * edge.speed + edge.offset) % 1
      const A = livePos[edge.a], B = livePos[edge.b]
      dummy.position.set(
        A.x + (B.x - A.x) * p,
        A.y + (B.y - A.y) * p,
        A.z + (B.z - A.z) * p,
      )
      // pulse brightens mid-flight, fades at the ends
      const glow = Math.sin(p * Math.PI)
      dummy.scale.setScalar(0.04 + glow * 0.09)
      dummy.updateMatrix()
      pulsesRef.current.setMatrixAt(e, dummy.matrix)
    }
    pulsesRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group ref={group} position={position}>
      {/* synapse lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[linePositions, 3]} count={edgeCount * 2} />
        </bufferGeometry>
        <lineBasicMaterial color="#3b4a8f" transparent opacity={0.28} />
      </lineSegments>

      {/* neuron nodes */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodeCount]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#0b1030" emissive="#818cf8"
          emissiveIntensity={2.2} roughness={0.3} metalness={0.6} />
      </instancedMesh>

      {/* travelling signal pulses */}
      <instancedMesh ref={pulsesRef} args={[undefined, undefined, edgeCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.95} />
      </instancedMesh>
    </group>
  )
}
