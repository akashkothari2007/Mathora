'use client'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useRef, useEffect } from 'react'

export type ShadeAreaProps = {
  f: (x:number)=>number
  g?: (x:number)=>number
  xmin: number
  xmax: number
  steps?: number
  color?: string
  opacity?: number
  animateTo?: {
    f?: (x:number)=>number
    g?: (x:number)=>number
    xmin?: number
    xmax?: number
  }
  animateDuration?: number
}

export default function ShadeArea({
  f, g, xmin, xmax, steps=200,
  color='#4ade80', opacity=0.5,
  animateTo, animateDuration=0.2
}: ShadeAreaProps) {
  // Default g to x-axis (y=0) if not provided
  const gFunc = g ?? ((x: number) => 0)

  // Compute base points - always same length, no filtering
  const baseTop = useMemo(() => computePoints(f, xmin, xmax, steps), [f, xmin, xmax, steps])
  const baseBottom = useMemo(() => computePoints(gFunc, xmin, xmax, steps), [gFunc, xmin, xmax, steps])

  // Create geometry ref - initialize immediately
  const geometryRef = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry())
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null)
  
  // Refs for animation
  const progressRef = useRef(1)
  const fadeRef = useRef(0)
  
  const currentTopRef = useRef(baseTop.map(p => p.clone()))
  const currentBottomRef = useRef(baseBottom.map(p => p.clone()))
  const targetTopRef = useRef<THREE.Vector3[] | null>(null)
  const targetBottomRef = useRef<THREE.Vector3[] | null>(null)
  const animBaseTopRef = useRef<THREE.Vector3[]>(baseTop.map(p => p.clone()))
  const animBaseBottomRef = useRef<THREE.Vector3[]>(baseBottom.map(p => p.clone()))

  // Create geometry from points using triangles
  const updateGeometry = useRef(() => {
    const top = currentTopRef.current
    const bottom = currentBottomRef.current
    
    if (top.length === 0 || bottom.length === 0 || top.length !== bottom.length) {
      return
    }

    const vertices: number[] = []
    const indices: number[] = []
    
    // Create quads (two triangles) between consecutive points
    for (let i = 0; i < top.length - 1; i++) {
      const t0 = top[i]
      const t1 = top[i + 1]
      const b0 = bottom[i]
      const b1 = bottom[i + 1]
      
      // Skip if any point is invalid
      if (!isValidPoint(t0) || !isValidPoint(t1) || !isValidPoint(b0) || !isValidPoint(b1)) {
        continue
      }
      
      const baseIdx = vertices.length / 3
      
      // Add vertices: t0, t1, b0, b1
      vertices.push(t0.x, t0.y, t0.z)
      vertices.push(t1.x, t1.y, t1.z)
      vertices.push(b0.x, b0.y, b0.z)
      vertices.push(b1.x, b1.y, b1.z)
      
      // First triangle: t0 -> t1 -> b0
      indices.push(baseIdx, baseIdx + 1, baseIdx + 2)
      // Second triangle: t1 -> b1 -> b0
      indices.push(baseIdx + 1, baseIdx + 3, baseIdx + 2)
    }
    
    if (vertices.length === 0) {
      return
    }
    
    geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometryRef.current.setIndex(indices)
    geometryRef.current.computeVertexNormals()
    geometryRef.current.attributes.position.needsUpdate = true
  })

  // Update when base changes
  useEffect(() => {
    currentTopRef.current = baseTop.map(p => p.clone())
    currentBottomRef.current = baseBottom.map(p => p.clone())
    animBaseTopRef.current = baseTop.map(p => p.clone())
    animBaseBottomRef.current = baseBottom.map(p => p.clone())
    progressRef.current = 1
    targetTopRef.current = null
    targetBottomRef.current = null
    updateGeometry.current()
  }, [baseTop, baseBottom])

  // Handle animation target
  useEffect(() => {
    if (!animateTo) {
      targetTopRef.current = null
      targetBottomRef.current = null
      progressRef.current = 1
      return
    }

    const newF = animateTo.f ?? f
    const newG = animateTo.g ?? gFunc
    const newXmin = animateTo.xmin ?? xmin
    const newXmax = animateTo.xmax ?? xmax

    targetTopRef.current = computePoints(newF, newXmin, newXmax, steps)
    targetBottomRef.current = computePoints(newG, newXmin, newXmax, steps)
    animBaseTopRef.current = currentTopRef.current.map(p => p.clone())
    animBaseBottomRef.current = currentBottomRef.current.map(p => p.clone())
    progressRef.current = 0
  }, [animateTo, f, gFunc, xmin, xmax, steps])

  // Animation loop
  useFrame((_, delta) => {
    // Fade in
    fadeRef.current = Math.min(fadeRef.current + delta * 1.5, 1)
    if (materialRef.current) {
      materialRef.current.opacity = opacity * fadeRef.current
    }

    // Handle morphing
    if (targetTopRef.current && targetBottomRef.current) {
      progressRef.current = Math.min(progressRef.current + (1 / animateDuration) * delta, 1)
      const t = progressRef.current

      // Lerp all points
      for (let i = 0; i < animBaseTopRef.current.length && i < targetTopRef.current.length; i++) {
        const base = animBaseTopRef.current[i]
        const target = targetTopRef.current[i]
        currentTopRef.current[i].set(
          base.x + (target.x - base.x) * t,
          base.y + (target.y - base.y) * t,
          0
        )
      }
      
      for (let i = 0; i < animBaseBottomRef.current.length && i < targetBottomRef.current.length; i++) {
        const base = animBaseBottomRef.current[i]
        const target = targetBottomRef.current[i]
        currentBottomRef.current[i].set(
          base.x + (target.x - base.x) * t,
          base.y + (target.y - base.y) * t,
          0
        )
      }

      updateGeometry.current()

      // Reset when done
      if (progressRef.current >= 1) {
        animBaseTopRef.current = currentTopRef.current.map(p => p.clone())
        animBaseBottomRef.current = currentBottomRef.current.map(p => p.clone())
        targetTopRef.current = null
        targetBottomRef.current = null
      }
    }
  })

  // Initial geometry creation
  useEffect(() => {
    updateGeometry.current()
  }, [])

  return (
    <mesh geometry={geometryRef.current}>
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={opacity * fadeRef.current}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function computePoints(func: (x: number) => number, xmin: number, xmax: number, steps: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = xmin + t * (xmax - xmin)
    let y: number
    try {
      y = func(x)
    } catch {
      y = 0
    }
    
    // Use 0 for invalid values instead of filtering
    if (!isFinite(y)) {
      y = 0
    }
    
    points.push(new THREE.Vector3(x, y, 0))
  }
  
  return points
}

function isValidPoint(p: THREE.Vector3): boolean {
  return isFinite(p.x) && isFinite(p.y) && isFinite(p.z)
}