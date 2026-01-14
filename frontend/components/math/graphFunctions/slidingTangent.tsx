'use client'

import { useState, useRef, useEffect } from 'react'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type SlidingTangentProps = {
  f: (x: number) => number
  startX: number
  endX: number
  duration?: number
  xmin?: number
  xmax?: number
  color?: string
  lineWidth?: number
}

export default function SlidingTangent({
  f,
  startX,
  endX,
  duration = 3,
  xmin = -5,
  xmax = 5,
  color = 'blue',
  lineWidth = 1,
}: SlidingTangentProps) {
  // 0 → 1 over the animation
  const tRef = useRef(0)

  // Line endpoints
  const [points, setPoints] = useState<THREE.Vector3[]>(() => [
    new THREE.Vector3(xmin, f(xmin), 0),
    new THREE.Vector3(xmax, f(xmax), 0),
  ])

  // Reset animation if any key parameter changes
  useEffect(() => {
    tRef.current = 0
  }, [startX, endX, duration, f, xmin, xmax])

  useFrame((_, delta) => {
    // advance time
    const t = Math.min(tRef.current + delta / duration, 1)
    tRef.current = t

    // current x along the path
    const a = startX + (endX - startX) * t

    // numeric derivative
    const h = 1e-3
    const fa = f(a)
    const m = (f(a + h) - f(a - h)) / (2 * h)
    const b = fa - m * a

    const x1 = xmin
    const x2 = xmax
    const y1 = m * x1 + b
    const y2 = m * x2 + b

    setPoints([
      new THREE.Vector3(x1, y1, 0),
      new THREE.Vector3(x2, y2, 0),
    ])
  })

  return <Line points={points} color={color} lineWidth={lineWidth} />
}